const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
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

// Obtenir tous les plats d'un restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { categorie, recherche, page = 1, limite = 10 } = req.query;
    let query = { restaurantId: req.params.restaurantId };

    if (categorie) {
      query.categorie = categorie;
    }

    if (recherche) {
      query.$text = { $search: recherche };
    }

    const plats = await Dish.find(query)
      .skip((page - 1) * limite)
      .limit(parseInt(limite))
      .sort({ popular: -1, createdAt: -1 });

    const total = await Dish.countDocuments(query);

    res.json({
      plats,
      total,
      pages: Math.ceil(total / limite),
      page: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plats', error: error.message });
  }
});

// Obtenir un plat par ID
router.get('/:id', async (req, res) => {
  try {
    const plat = await Dish.findById(req.params.id);
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(plat);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du plat', error: error.message });
  }
});

// Créer un plat (restaurateur seulement)
router.post('/', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du restaurant
    if (restaurant.proprietaireId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à ajouter des plats à ce restaurant' });
    }

    const plat = new Dish(req.body);
    await plat.save();

    res.status(201).json(plat);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du plat', error: error.message });
  }
});

// Mettre à jour un plat
router.put('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const plat = await Dish.findById(req.params.id);
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }

    const restaurant = await Restaurant.findById(plat.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du restaurant
    if (restaurant.proprietaireId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à modifier ce plat' });
    }

    const platMisAJour = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(platMisAJour);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du plat', error: error.message });
  }
});

// Supprimer un plat
router.delete('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const plat = await Dish.findById(req.params.id);
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }

    const restaurant = await Restaurant.findById(plat.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }

    // Vérifier que l'utilisateur est le propriétaire du restaurant
    if (restaurant.proprietaireId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce plat' });
    }

    await Dish.findByIdAndDelete(req.params.id);

    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du plat', error: error.message });
  }
});

// Obtenir les plats populaires
router.get('/populaires/all', async (req, res) => {
  try {
    const plats = await Dish.find({ popular: true })
      .limit(10)
      .populate('restaurantId', 'nom');

    res.json(plats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plats populaires', error: error.message });
  }
});

module.exports = router; 