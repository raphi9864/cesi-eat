const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Middleware de vérification du token et des rôles
const checkRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token non fourni' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  };
};

// Créer une nouvelle commande
router.post('/', checkRole(['client']), async (req, res) => {
  try {
    const commande = new Order({
      ...req.body,
      clientId: req.user.userId,
      prixTotal: 0
    });

    // Calculer le prix total
    commande.prixTotal = commande.calculerPrixTotal();
    
    // Ajouter l'événement initial
    commande.ajouterEvenement('en_attente', 'Commande créée');
    
    await commande.save();

    // Publier l'événement de création de commande
    if (global.channel) {
      global.channel.publish('cesi-eat', 'order.created', Buffer.from(JSON.stringify({
        orderId: commande._id,
        restaurantId: commande.restaurantId,
        status: commande.statut
      })));
    }

    res.status(201).json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
  }
});

// Obtenir toutes les commandes (avec filtres)
router.get('/', checkRole(['admin', 'restaurateur', 'livreur', 'client']), async (req, res) => {
  try {
    const { page = 1, limite = 10, statut } = req.query;
    let query = {};

    // Filtrer selon le rôle
    switch (req.user.role) {
      case 'client':
        query.clientId = req.user.userId;
        break;
      case 'restaurateur':
        query.restaurantId = req.user.restaurantId;
        break;
      case 'livreur':
        query.livreurId = req.user.userId;
        break;
      // Admin peut voir toutes les commandes
    }

    if (statut) {
      query.statut = statut;
    }

    const commandes = await Order.find(query)
      .skip((page - 1) * limite)
      .limit(parseInt(limite))
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'nom')
      .populate('clientId', 'nom prenom')
      .populate('livreurId', 'nom prenom');

    const total = await Order.countDocuments(query);

    res.json({
      commandes,
      total,
      pages: Math.ceil(total / limite),
      page: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
});

// Obtenir une commande par ID
router.get('/:id', checkRole(['admin', 'restaurateur', 'livreur', 'client']), async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id)
      .populate('restaurantId', 'nom')
      .populate('clientId', 'nom prenom')
      .populate('livreurId', 'nom prenom');

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier les droits d'accès
    if (req.user.role === 'client' && commande.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
    }

    if (req.user.role === 'restaurateur' && commande.restaurantId.toString() !== req.user.restaurantId) {
      return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
    }

    if (req.user.role === 'livreur' && commande.livreurId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à cette commande' });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
  }
});

// Mettre à jour le statut d'une commande
router.patch('/:id/statut', checkRole(['admin', 'restaurateur', 'livreur']), async (req, res) => {
  try {
    const { statut, commentaire } = req.body;
    const commande = await Order.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier les droits de modification selon le rôle
    if (req.user.role === 'restaurateur') {
      if (commande.restaurantId.toString() !== req.user.restaurantId) {
        return res.status(403).json({ message: 'Non autorisé à modifier cette commande' });
      }
      
      const statutsAutorises = ['acceptee', 'en_preparation', 'prete'];
      if (!statutsAutorises.includes(statut)) {
        return res.status(400).json({ message: 'Statut non autorisé pour un restaurateur' });
      }
    }

    if (req.user.role === 'livreur') {
      if (commande.livreurId?.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Non autorisé à modifier cette commande' });
      }
      
      const statutsAutorises = ['en_livraison', 'livree'];
      if (!statutsAutorises.includes(statut)) {
        return res.status(400).json({ message: 'Statut non autorisé pour un livreur' });
      }
    }

    commande.ajouterEvenement(statut, commentaire);
    await commande.save();

    // Publier l'événement de mise à jour
    if (global.channel) {
      global.channel.publish('cesi-eat', 'order.updated', Buffer.from(JSON.stringify({
        orderId: commande._id,
        status: commande.statut,
        updatedBy: {
          userId: req.user.userId,
          role: req.user.role
        }
      })));
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
});

// Annuler une commande
router.post('/:id/annuler', checkRole(['admin', 'client']), async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que c'est bien le client qui annule sa commande
    if (req.user.role === 'client' && commande.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorisé à annuler cette commande' });
    }

    // Vérifier si la commande peut être annulée
    if (!commande.peutEtreAnnulee()) {
      return res.status(400).json({ message: 'Cette commande ne peut plus être annulée' });
    }

    commande.ajouterEvenement('annulee', 'Commande annulée par ' + req.user.role);
    await commande.save();

    // Publier l'événement d'annulation
    if (global.channel) {
      global.channel.publish('cesi-eat', 'order.cancelled', Buffer.from(JSON.stringify({
        orderId: commande._id,
        cancelledBy: {
          userId: req.user.userId,
          role: req.user.role
        }
      })));
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'annulation de la commande', error: error.message });
  }
});

module.exports = router; 