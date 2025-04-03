const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rue: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: true
  },
  codePostal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pays: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true
  },
  horaires: {
    type: DataTypes.JSON,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'default-restaurant.jpg'
  },
  note: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  nombreAvis: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  proprietaireId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('ouvert', 'fermé', 'en_pause'),
    defaultValue: 'fermé'
  },
  tempsLivraisonEstime: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fraisLivraison: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  commandeMinimum: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true
});

// Méthodes d'instance
Restaurant.prototype.calculerNoteMoyenne = function(nouvelleNote) {
  const totalNotes = this.note * this.nombreAvis;
  this.nombreAvis += 1;
  this.note = (totalNotes + nouvelleNote) / this.nombreAvis;
  return this.save();
};

Restaurant.prototype.estOuvert = function() {
  const maintenant = new Date();
  const jour = maintenant.toLocaleDateString('fr-FR', { weekday: 'long' });
  const heure = maintenant.getHours() + ':' + maintenant.getMinutes();

  const horaires = JSON.parse(this.horaires);
  const horairesJour = horaires[jour];
  
  if (!horairesJour || !horairesJour.ouverture || !horairesJour.fermeture) {
    return false;
  }

  return heure >= horairesJour.ouverture && heure <= horairesJour.fermeture;
};

module.exports = Restaurant;