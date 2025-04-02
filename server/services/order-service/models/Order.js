const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  livreurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  plats: [{
    platId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: 1
    },
    prix: {
      type: Number,
      required: true
    },
    options: [{
      nom: String,
      prix: Number
    }]
  }],
  statut: {
    type: String,
    enum: ['en_attente', 'acceptee', 'en_preparation', 'prete', 'en_livraison', 'livree', 'annulee'],
    default: 'en_attente'
  },
  adresseLivraison: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: String,
    instructions: String
  },
  prixTotal: {
    type: Number,
    required: true
  },
  fraisLivraison: {
    type: Number,
    required: true
  },
  tempsPreparationEstime: {
    type: Number,
    required: true
  },
  tempsLivraisonEstime: {
    type: Number
  },
  methodePaiement: {
    type: String,
    enum: ['carte', 'especes'],
    required: true
  },
  paiementStatus: {
    type: String,
    enum: ['en_attente', 'valide', 'refuse'],
    default: 'en_attente'
  },
  commentaire: String,
  historique: [{
    statut: String,
    date: {
      type: Date,
      default: Date.now
    },
    commentaire: String
  }]
}, {
  timestamps: true
});

// Méthode pour calculer le prix total
orderSchema.methods.calculerPrixTotal = function() {
  let total = 0;
  
  // Calculer le prix des plats et leurs options
  this.plats.forEach(plat => {
    let prixPlat = plat.prix * plat.quantite;
    if (plat.options) {
      plat.options.forEach(option => {
        prixPlat += option.prix * plat.quantite;
      });
    }
    total += prixPlat;
  });

  // Ajouter les frais de livraison
  total += this.fraisLivraison;

  return total;
};

// Méthode pour ajouter un événement à l'historique
orderSchema.methods.ajouterEvenement = function(statut, commentaire = '') {
  this.historique.push({
    statut,
    commentaire,
    date: new Date()
  });
  this.statut = statut;
};

// Méthode pour vérifier si la commande peut être annulée
orderSchema.methods.peutEtreAnnulee = function() {
  const statutsAnnulables = ['en_attente', 'acceptee', 'en_preparation'];
  return statutsAnnulables.includes(this.statut);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 