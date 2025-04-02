const express = require('express');
const router = express.Router();
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

// Obtenir tous les restaurants
router.get('/', async (req, res) => {
  try {
    const { categorie, ville, recherche, page = 1, limite = 10 } = req.query;
    let query = {};

    if (categorie) {
      query.categories = categorie;
    }

    if (ville) {
      query['adresse.ville'] = ville;
    }

    if (recherche) {
      query.$text = { $search: recherche };
    }

    const restaurants = await Restaurant.find(query)
      .skip((page - 1) * limite)
      .limit(parseInt(limite))
      .sort({ note: -1 });

    const total = await Restaurant.countDocuments(query);

    res.json({
      restaurants,
      total,
      pages: Math.ceil(total / limite),
      page: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurants', error: error.message });
  }
});

// Obtenir un restaurant par ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
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
    const restaurant = new Restaurant({
      ...req.body,
      proprietaireId: req.user.userId
    });

    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du restaurant', error: error.message });
  }
});

// Mettre à jour un restaurant
router.put('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (restaurant.proprietaireId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à modifier ce restaurant' });
    }

    const restaurantMisAJour = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(restaurantMisAJour);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du restaurant', error: error.message });
  }
});

// Supprimer un restaurant
router.delete('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (restaurant.proprietaireId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce restaurant' });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ message: 'Restaurant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du restaurant', error: error.message });
  }
});

// Ajouter une note à un restaurant
router.post('/:id/noter', checkRole(['client']), async (req, res) => {
  try {
    const { note } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    restaurant.calculerNoteMoyenne(note);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la note', error: error.message });
  }
});

// Obtenir les restaurants populaires
router.get('/populaires', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ note: { $gte: 4 } })
      .sort({ note: -1, nombreAvis: -1 })
      .limit(10);

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurants populaires', error: error.message });
  }
});

module.exports = router; 