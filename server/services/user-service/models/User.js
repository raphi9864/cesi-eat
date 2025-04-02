const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sous-schéma pour le profil restaurateur
const RestaurateurProfileSchema = new mongoose.Schema({
  restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  description: String,
  cuisineSpeciality: [String],
  businessHours: String,
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Sous-schéma pour le profil livreur
const LivreurProfileSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    enum: ['vélo', 'scooter', 'voiture', 'à pied'],
    default: 'vélo'
  },
  licenseNumber: String,
  isAvailable: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'restaurateur', 'livreur', 'admin'],
    default: 'client'
  },
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: String
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'en_attente'],
    default: 'actif'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  // Profils spécifiques aux rôles
  restaurateurProfile: RestaurateurProfileSchema,
  livreurProfile: LivreurProfileSchema,
  // Informations supplémentaires pour tous les utilisateurs
  profileImage: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash du mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Méthode pour vérifier si l'utilisateur est un restaurateur
userSchema.methods.isRestaurateur = function() {
  return this.role === 'restaurateur';
};

// Méthode pour vérifier si l'utilisateur est un livreur
userSchema.methods.isLivreur = function() {
  return this.role === 'livreur';
};

// Méthode pour vérifier si l'utilisateur est un admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Méthode pour récupérer le profil en fonction du rôle
userSchema.methods.getProfileByRole = function() {
  switch (this.role) {
    case 'restaurateur':
      return this.restaurateurProfile;
    case 'livreur':
      return this.livreurProfile;
    default:
      return {};
  }
};

// Indexation géospatiale pour les livreurs
userSchema.index({ 'livreurProfile.currentLocation': '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;