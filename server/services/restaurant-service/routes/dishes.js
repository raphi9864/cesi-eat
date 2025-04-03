const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
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
    let where = { restaurantId: req.params.restaurantId };
    let options = {
      limit: parseInt(limite),
      offset: (page - 1) * parseInt(limite),
      order: [['createdAt', 'DESC']]
    };

    if (categorie) {
      where.categorie = categorie;
    }

    if (recherche) {
      where[Op.or] = [
        { nom: { [Op.like]: `%${recherche}%` } },
        { description: { [Op.like]: `%${recherche}%` } }
      ];
    }

    options.where = where;

    const { count, rows: dishes } = await Dish.findAndCountAll(options);

    res.json({
      dishes,
      total: count,
      pages: Math.ceil(count / limite),
      page: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des plats', error: error.message });
  }
});

// Obtenir un plat par ID
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du plat', error: error.message });
  }
});

// Créer un plat (restaurateur seulement)
router.post('/', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const { restaurantId } = req.body;
    
    // Vérifier si le restaurant existe
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    // Vérifier que l'utilisateur est le propriétaire du restaurant ou un admin
    if (restaurant.proprietaireId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à ajouter un plat à ce restaurant' });
    }
    
    const dish = await Dish.create(req.body);
    
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du plat', error: error.message });
  }
});

// Mettre à jour un plat
router.put('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire du restaurant associé ou un admin
    const restaurant = await Restaurant.findByPk(dish.restaurantId);
    
    if (restaurant.proprietaireId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à modifier ce plat' });
    }
    
    await dish.update(req.body);
    
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du plat', error: error.message });
  }
});

// Supprimer un plat
router.delete('/:id', checkRole(['restaurateur', 'admin']), async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    
    // Vérifier si l'utilisateur est le propriétaire du restaurant associé ou un admin
    const restaurant = await Restaurant.findByPk(dish.restaurantId);
    
    if (restaurant.proprietaireId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce plat' });
    }
    
    await dish.destroy();
    
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