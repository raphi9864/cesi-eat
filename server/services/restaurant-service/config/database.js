const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('restaurant_db', 'restaurant_user', 'restaurant_password', {
  host: 'mysql',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize; 