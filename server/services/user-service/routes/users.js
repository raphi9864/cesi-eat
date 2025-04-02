const express = require('express');
const router = express.Router();
const User = require('../models/User');
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

// Obtenir tous les utilisateurs (admin seulement)
router.get('/', checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
});

// Obtenir un utilisateur par ID
router.get('/:id', checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', checkRole(['admin']), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
  }
});

// Supprimer un utilisateur
router.delete('/:id', checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
});

// Obtenir tous les livreurs
router.get('/role/livreurs', async (req, res) => {
  try {
    const livreurs = await User.find({ role: 'livreur' }).select('-password');
    res.json(livreurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des livreurs', error: error.message });
  }
});

// Obtenir tous les restaurateurs
router.get('/role/restaurateurs', async (req, res) => {
  try {
    const restaurateurs = await User.find({ role: 'restaurateur' }).select('-password');
    res.json(restaurateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des restaurateurs', error: error.message });
  }
});

module.exports = router; 