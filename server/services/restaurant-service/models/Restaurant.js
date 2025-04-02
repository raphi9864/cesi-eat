const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: String
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  categories: [{
    type: String
  }],
  horaires: {
    lundi: { ouverture: String, fermeture: String },
    mardi: { ouverture: String, fermeture: String },
    mercredi: { ouverture: String, fermeture: String },
    jeudi: { ouverture: String, fermeture: String },
    vendredi: { ouverture: String, fermeture: String },
    samedi: { ouverture: String, fermeture: String },
    dimanche: { ouverture: String, fermeture: String }
  },
  image: {
    type: String,
    default: 'default-restaurant.jpg'
  },
  note: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  nombreAvis: {
    type: Number,
    default: 0
  },
  proprietaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statut: {
    type: String,
    enum: ['ouvert', 'fermé', 'en_pause'],
    default: 'fermé'
  },
  tempsLivraisonEstime: {
    type: Number,
    required: true,
    min: 5,
    max: 120
  },
  fraisLivraison: {
    type: Number,
    required: true,
    min: 0
  },
  commandeMinimum: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Index géospatial pour la recherche par proximité
restaurantSchema.index({ "adresse.location": "2dsphere" });

// Index de recherche textuelle
restaurantSchema.index({
  nom: 'text',
  description: 'text',
  'categories': 'text'
});

// Méthode pour calculer la note moyenne
restaurantSchema.methods.calculerNoteMoyenne = function(nouvelleNote) {
  const totalNotes = this.note * this.nombreAvis;
  this.nombreAvis += 1;
  this.note = (totalNotes + nouvelleNote) / this.nombreAvis;
};

// Méthode pour vérifier si le restaurant est ouvert
restaurantSchema.methods.estOuvert = function() {
  const maintenant = new Date();
  const jour = maintenant.toLocaleDateString('fr-FR', { weekday: 'long' });
  const heure = maintenant.getHours() + ':' + maintenant.getMinutes();

  const horairesJour = this.horaires[jour];
  if (!horairesJour || !horairesJour.ouverture || !horairesJour.fermeture) {
    return false;
  }

  return heure >= horairesJour.ouverture && heure <= horairesJour.fermeture;
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;