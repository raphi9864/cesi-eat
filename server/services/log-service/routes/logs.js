const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
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

// Créer un nouveau log (accessible par tous les services)
router.post('/', async (req, res) => {
  try {
    const { service, level, message, metadata } = req.body;
    
    const log = await Log.createLog(service, level, message, {
      ...metadata,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du log', error: error.message });
  }
});

// Obtenir les logs (admin uniquement)
router.get('/', checkRole(['admin']), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      service,
      level,
      userId,
      startDate,
      endDate
    } = req.query;

    const filters = {
      service,
      level,
      userId,
      startDate,
      endDate
    };

    const logs = await Log.findByFilters(filters, parseInt(page), parseInt(limit));
    const total = await Log.countDocuments(filters);

    res.json({
      logs,
      total,
      pages: Math.ceil(total / limit),
      page: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des logs', error: error.message });
  }
});

// Obtenir les statistiques des logs (admin uniquement)
router.get('/stats', checkRole(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const stats = await Promise.all([
      // Total par service
      Log.aggregate([
        { $match: query },
        { $group: { _id: '$service', count: { $sum: 1 } } }
      ]),
      // Total par niveau
      Log.aggregate([
        { $match: query },
        { $group: { _id: '$level', count: { $sum: 1 } } }
      ]),
      // Erreurs par service
      Log.aggregate([
        { $match: { ...query, level: 'error' } },
        { $group: { _id: '$service', errorCount: { $sum: 1 } } }
      ])
    ]);

    res.json({
      serviceStats: stats[0],
      levelStats: stats[1],
      errorStats: stats[2]
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
});

// Supprimer les vieux logs (admin uniquement)
router.delete('/cleanup', checkRole(['admin']), async (req, res) => {
  try {
    const { olderThan } = req.query; // en jours
    const date = new Date();
    date.setDate(date.getDate() - parseInt(olderThan || 30));

    const result = await Log.deleteMany({
      timestamp: { $lt: date }
    });

    res.json({
      message: `${result.deletedCount} logs supprimés`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des logs', error: error.message });
  }
});

module.exports = router; 