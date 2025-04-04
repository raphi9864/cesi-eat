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
    allowNull: true
  },
  rue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codePostal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pays: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  categories: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('categories');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('categories', JSON.stringify(value));
    }
  },
  horaires: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('horaires');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('horaires', JSON.stringify(value));
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  note: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  nombreAvis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  proprietaireId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('ouvert', 'fermé', 'en pause'),
    allowNull: false,
    defaultValue: 'fermé'
  },
  tempsLivraisonEstime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  fraisLivraison: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  commandeMinimum: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
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