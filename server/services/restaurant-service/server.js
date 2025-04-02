require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const amqp = require('amqplib');

const restaurantRoutes = require('./routes/restaurant');
const dishRoutes = require('./routes/dishes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Connexion à RabbitMQ
let channel;
async function connectQueue() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
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

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);

// Route de test
app.get('/api/test', (req, res) => {
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
