require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const amqp = require('amqplib');

const sequelize = require('./config/database');
const Restaurant = require('./models/Restaurant');
const Dish = require('./models/Dish');

const restaurantRoutes = require('./routes/restaurant');
const dishRoutes = require('./routes/dishes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connexion à MySQL avec Sequelize
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connecté à MySQL via Sequelize');
    
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: true });
    console.log('Modèles synchronisés avec la base de données');
  } catch (error) {
    console.error('Erreur de connexion à MySQL:', error);
  }
}

connectToDatabase();

// Connexion à RabbitMQ
let channel;
async function connectQueue() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://guest:guest@rabbitmq:5672');
    channel = await connection.createChannel();
    
    // Déclarer les exchanges et queues nécessaires
    await channel.assertExchange('cesi-eat', 'topic', { durable: false });
    await channel.assertQueue('restaurant-service-queue', { durable: false });
    
    // Binding des queues avec les routing keys appropriés
    await channel.bindQueue('restaurant-service-queue', 'cesi-eat', 'restaurant.*');
    await channel.bindQueue('restaurant-service-queue', 'cesi-eat', 'order.*');
    
    console.log('Connecté à RabbitMQ');
    
    // Consommer les messages
    channel.consume('restaurant-service-queue', async (data) => {
      const message = JSON.parse(data.content);
      console.log('Message reçu:', message);
      
      // Traiter le message selon son type
      switch (message.event) {
        case 'order.created':
          // Traiter la nouvelle commande
          break;
        case 'order.cancelled':
          // Traiter l'annulation de commande
          break;
        default:
          console.log('Event non géré:', message.event);
      }
      
      channel.ack(data);
    });
  } catch (error) {
    console.error('Erreur de connexion à RabbitMQ:', error);
  }
}

connectQueue();

// Créer des données fictives pour les tests
async function seedDatabase() {
  try {
    const count = await Restaurant.count();
    if (count === 0) {
      console.log('Création de données de test pour les restaurants...');
      
      // Créer quelques restaurants de test
      await Restaurant.bulkCreate([
        {
          nom: 'Pizza Delizioso',
          description: 'Les meilleures pizzas italiennes authentiques.',
          rue: '42 Rue de la Pizza',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France',
          telephone: '01 23 45 67 89',
          email: 'contact@pizzadelizioso.fr',
          categories: JSON.stringify(['Italien', 'Pizza', 'Pâtes']),
          horaires: JSON.stringify({
            lundi: { ouverture: '11:00', fermeture: '22:00' },
            mardi: { ouverture: '11:00', fermeture: '22:00' },
            mercredi: { ouverture: '11:00', fermeture: '22:00' },
            jeudi: { ouverture: '11:00', fermeture: '22:00' },
            vendredi: { ouverture: '11:00', fermeture: '23:00' },
            samedi: { ouverture: '11:00', fermeture: '23:00' },
            dimanche: { ouverture: '12:00', fermeture: '22:00' }
          }),
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          note: 4.5,
          nombreAvis: 120,
          proprietaireId: 'resto1',
          statut: 'ouvert',
          tempsLivraisonEstime: 30,
          fraisLivraison: 2.99,
          commandeMinimum: 15.00
        },
        {
          nom: 'Burger House',
          description: 'Délicieux burgers maison avec des ingrédients frais.',
          rue: '15 Avenue des Burgers',
          ville: 'Lyon',
          codePostal: '69001',
          pays: 'France',
          telephone: '04 56 78 90 12',
          email: 'contact@burgerhouse.fr',
          categories: JSON.stringify(['Américain', 'Burger', 'Fast-food']),
          horaires: JSON.stringify({
            lundi: { ouverture: '11:30', fermeture: '22:30' },
            mardi: { ouverture: '11:30', fermeture: '22:30' },
            mercredi: { ouverture: '11:30', fermeture: '22:30' },
            jeudi: { ouverture: '11:30', fermeture: '22:30' },
            vendredi: { ouverture: '11:30', fermeture: '23:30' },
            samedi: { ouverture: '11:30', fermeture: '23:30' },
            dimanche: { ouverture: '12:00', fermeture: '22:00' }
          }),
          image: 'https://images.unsplash.com/photo-1586816001966-79b736744398',
          note: 4.3,
          nombreAvis: 85,
          proprietaireId: 'resto2',
          statut: 'ouvert',
          tempsLivraisonEstime: 25,
          fraisLivraison: 3.50,
          commandeMinimum: 12.00
        },
        {
          nom: 'Sushi Master',
          description: 'Sushis et spécialités japonaises préparés par des chefs expérimentés.',
          rue: '8 Rue du Japon',
          ville: 'Bordeaux',
          codePostal: '33000',
          pays: 'France',
          telephone: '05 67 89 01 23',
          email: 'contact@sushimaster.fr',
          categories: JSON.stringify(['Japonais', 'Sushi', 'Asiatique']),
          horaires: JSON.stringify({
            lundi: { ouverture: '12:00', fermeture: '14:30' },
            mardi: { ouverture: '12:00', fermeture: '14:30' },
            mercredi: { ouverture: '12:00', fermeture: '14:30' },
            jeudi: { ouverture: '12:00', fermeture: '14:30' },
            vendredi: { ouverture: '12:00', fermeture: '14:30' },
            samedi: { ouverture: '19:00', fermeture: '23:00' },
            dimanche: { ouverture: '19:00', fermeture: '22:30' }
          }),
          image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
          note: 4.7,
          nombreAvis: 150,
          proprietaireId: 'resto3',
          statut: 'ouvert',
          tempsLivraisonEstime: 40,
          fraisLivraison: 4.50,
          commandeMinimum: 20.00
        }
      ]);
      
      console.log('Données de test pour les restaurants créées avec succès!');
    }
  } catch (error) {
    console.error('Erreur lors de la création des données de test:', error);
  }
}

// Appeler la fonction pour créer des données fictives
seedDatabase();

// Route spécifique pour les restaurants publics
app.get('/api/restaurants/public', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['note', 'DESC']]
    });
    res.json({ restaurants });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour la redirection de l'API Gateway
app.get('/api/public', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['note', 'DESC']]
    });
    res.json({ restaurants });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route spécifique pour la redirection depuis l'API Gateway
app.get('/public', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['note', 'DESC']]
    });
    res.json({ restaurants });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes
app.use('/', restaurantRoutes);
app.use('/', dishRoutes);

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Service restaurant opérationnel' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Service restaurant démarré sur le port ${PORT}`);
});
