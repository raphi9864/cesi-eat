const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    enum: ['user', 'restaurant', 'order', 'livreur', 'api-gateway']
  },
  level: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'error', 'debug']
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    userId: mongoose.Schema.Types.ObjectId,
    ip: String,
    userAgent: String,
    path: String,
    method: String,
    statusCode: Number,
    responseTime: Number,
    error: Object
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les recherches fréquentes
logSchema.index({ service: 1, level: 1, timestamp: -1 });
logSchema.index({ 'metadata.userId': 1, timestamp: -1 });

// Méthode statique pour créer un log
logSchema.statics.createLog = function(service, level, message, metadata = {}) {
  return this.create({
    service,
    level,
    message,
    metadata
  });
};

// Méthode statique pour rechercher des logs par critères
logSchema.statics.findByFilters = function(filters, page = 1, limit = 50) {
  const query = {};
  
  if (filters.service) query.service = filters.service;
  if (filters.level) query.level = filters.level;
  if (filters.userId) query['metadata.userId'] = filters.userId;
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
    if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
  }

  return this.find(query)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

const Log = mongoose.model('Log', logSchema);

module.exports = Log; 