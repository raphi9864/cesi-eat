const mongoose = require('mongoose');

const livreurSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  statut: {
    type: String,
    enum: ['disponible', 'en_livraison', 'indisponible'],
    default: 'indisponible'
  },
  position: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  vehicule: {
    type: String,
    enum: ['velo', 'scooter', 'voiture'],
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  note_moyenne: {
    type: Number,
    default: 0
  },
  nombre_livraisons: {
    type: Number,
    default: 0
  },
  disponible_depuis: {
    type: Date
  },
  dernier_emplacement_maj: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index géospatial pour les requêtes de localisation
livreurSchema.index({ position: '2dsphere' });

// Méthode pour mettre à jour la position
livreurSchema.methods.updatePosition = async function(longitude, latitude) {
  this.position.coordinates = [longitude, latitude];
  this.dernier_emplacement_maj = new Date();
  return this.save();
};

// Méthode pour mettre à jour le statut
livreurSchema.methods.updateStatut = async function(nouveauStatut) {
  this.statut = nouveauStatut;
  if (nouveauStatut === 'disponible') {
    this.disponible_depuis = new Date();
  }
  return this.save();
};

// Méthode pour calculer la distance avec un point
livreurSchema.methods.getDistance = function(longitude, latitude) {
  // Formule de Haversine pour calculer la distance
  const R = 6371; // Rayon de la Terre en km
  const [lon1, lat1] = this.position.coordinates;
  const lon2 = longitude;
  const lat2 = latitude;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
           Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Méthode statique pour trouver les livreurs disponibles dans un rayon
livreurSchema.statics.findAvailableNearby = function(longitude, latitude, maxDistance) {
  return this.find({
    statut: 'disponible',
    position: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Conversion en mètres
      }
    }
  }).sort('disponible_depuis');
};

const Livreur = mongoose.model('Livreur', livreurSchema);

module.exports = Livreur; 