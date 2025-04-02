const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: 'default-dish.jpg'
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  categorie: {
    type: String,
    required: true
  },
  allergenes: [{
    type: String
  }],
  disponible: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  tempsPreparation: {
    type: Number,
    required: true,
    min: 1
  },
  options: [{
    nom: String,
    prix: Number
  }],
  nutrition: {
    calories: Number,
    proteines: Number,
    glucides: Number,
    lipides: Number
  }
}, {
  timestamps: true
});

// Index de recherche textuelle
dishSchema.index({
  nom: 'text',
  description: 'text',
  categorie: 'text'
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish; 