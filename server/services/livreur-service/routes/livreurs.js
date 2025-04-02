const express = require('express');
const router = express.Router();
const Livreur = require('../models/Livreur');
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

// Créer un profil livreur
router.post('/', checkRole(['livreur']), async (req, res) => {
  try {
    const { vehicule, zone, position } = req.body;
    
    // Vérifier si le livreur existe déjà
    let livreur = await Livreur.findOne({ userId: req.user.userId });
    if (livreur) {
      return res.status(400).json({ message: 'Le profil livreur existe déjà' });
    }

    livreur = new Livreur({
      userId: req.user.userId,
      vehicule,
      zone,
      position: {
        type: 'Point',
        coordinates: position
      }
    });

    await livreur.save();
    res.status(201).json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du profil', error: error.message });
  }
});

// Mettre à jour la position
router.patch('/position', checkRole(['livreur']), async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const livreur = await Livreur.findOne({ userId: req.user.userId });

    if (!livreur) {
      return res.status(404).json({ message: 'Profil livreur non trouvé' });
    }

    await livreur.updatePosition(longitude, latitude);
    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la position', error: error.message });
  }
});

// Mettre à jour le statut
router.patch('/statut', checkRole(['livreur']), async (req, res) => {
  try {
    const { statut } = req.body;
    const livreur = await Livreur.findOne({ userId: req.user.userId });

    if (!livreur) {
      return res.status(404).json({ message: 'Profil livreur non trouvé' });
    }

    await livreur.updateStatut(statut);

    // Publier le changement de statut
    if (global.channel) {
      global.channel.publish('cesi-eat', 'livreur.status_updated', Buffer.from(JSON.stringify({
        livreurId: livreur._id,
        userId: req.user.userId,
        statut,
        position: livreur.position
      })));
    }

    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
});

// Obtenir les livreurs disponibles près d'un point
router.get('/disponibles', checkRole(['admin', 'restaurateur']), async (req, res) => {
  try {
    const { longitude, latitude, distance = 5 } = req.query; // distance en km
    
    const livreurs = await Livreur.findAvailableNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseFloat(distance)
    );

    res.json(livreurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche des livreurs', error: error.message });
  }
});

// Obtenir les statistiques d'un livreur
router.get('/stats', checkRole(['livreur']), async (req, res) => {
  try {
    const livreur = await Livreur.findOne({ userId: req.user.userId });

    if (!livreur) {
      return res.status(404).json({ message: 'Profil livreur non trouvé' });
    }

    res.json({
      nombre_livraisons: livreur.nombre_livraisons,
      note_moyenne: livreur.note_moyenne,
      statut_actuel: livreur.statut,
      zone: livreur.zone
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
});

// Mettre à jour le profil livreur
router.put('/', checkRole(['livreur']), async (req, res) => {
  try {
    const { vehicule, zone } = req.body;
    const livreur = await Livreur.findOne({ userId: req.user.userId });

    if (!livreur) {
      return res.status(404).json({ message: 'Profil livreur non trouvé' });
    }

    livreur.vehicule = vehicule || livreur.vehicule;
    livreur.zone = zone || livreur.zone;

    await livreur.save();
    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
});

module.exports = router; 