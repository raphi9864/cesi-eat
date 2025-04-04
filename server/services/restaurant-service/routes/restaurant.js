const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Restaurant = require('../models/Restaurant');
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

// Route publique pour obtenir tous les restaurants sur la racine publique
router.get('/api/restaurants/public', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['note', 'DESC']]
    });
    res.json({ restaurants });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route publique pour obtenir tous les restaurants
router.get('/public', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['note', 'DESC']]
    });
    res.json({ restaurants });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les restaurants (avec authentification)
router.get('/', async (req, res) => {
  try {
    const { categorie, ville, recherche, page = 1, limite = 10 } = req.query;
    let where = {};
    let options = {
      limit: parseInt(limite),
      offset: (page - 1) * parseInt(limite),
      order: [['note', 'DESC']]
    };

    if (categorie) {
      where.categories = { [Op.like]: `%${categorie}%` };
    }

    if (ville) {
      where.ville = ville;
    }

    if (recherche) {
      where[Op.or] = [
        { nom: { [Op.like]: `%${recherche}%` } },
        { description: { [Op.like]: `%${recherche}%` } }
      ];
    }

    options.where = where;

    const { count, rows: restaurants } = await Restaurant.findAndCountAll(options);

    res.json({
      restaurants,
      total: count,
      pages: Math.ceil(count / limite),
      page: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurants', error: error.message });
  }
});

// Obtenir un restaurant par ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du restaurant', error: error.message });
  }
});

// Créer un restaurant (restaurateur seulement)
router.post('/', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      proprietaireId: req.user.userId
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du restaurant', error: error.message });
  }
});

// Mettre à jour un restaurant
router.put('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (restaurant.proprietaireId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à modifier ce restaurant' });
    }

    await restaurant.update(req.body);

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du restaurant', error: error.message });
  }
});

// Supprimer un restaurant
router.delete('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (restaurant.proprietaireId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce restaurant' });
    }

    await restaurant.destroy();

    res.json({ message: 'Restaurant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du restaurant', error: error.message });
  }
});

// Ajouter une note à un restaurant
router.post('/:id/noter', checkRole(['client']), async (req, res) => {
  try {
    const { note } = req.body;
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    restaurant.calculerNoteMoyenne(note);

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la note', error: error.message });
  }
});

// Obtenir les restaurants populaires
router.get('/populaires', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: {
        note: { [Op.gte]: 4 }
      },
      order: [
        ['note', 'DESC'],
        ['nombreAvis', 'DESC']
      ],
      limit: 10
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurants populaires', error: error.message });
  }
});

module.exports = router; 