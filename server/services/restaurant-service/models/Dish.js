const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Restaurant = require('./Restaurant');

const Dish = sequelize.define('Dish', {
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
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'default-dish.jpg'
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allergenes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  estVegetarien: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  estVegan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Restaurant,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Définir la relation avec Restaurant
Dish.belongsTo(Restaurant);
Restaurant.hasMany(Dish);

module.exports = Dish; 