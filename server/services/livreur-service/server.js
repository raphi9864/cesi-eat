require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const amqp = require('amqplib');

const livreurRoutes = require('./routes/livreurs');

const app = express();
const PORT = process.env.PORT || 3005;

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
    global.channel = channel;
    
    // Déclarer les exchanges et queues nécessaires
    await channel.assertExchange('cesi-eat', 'topic', { durable: false });
    await channel.assertQueue('livreur-service-queue', { durable: false });
    
    // Binding des queues avec les routing keys appropriés
    await channel.bindQueue('livreur-service-queue', 'cesi-eat', 'order.ready');
    await channel.bindQueue('livreur-service-queue', 'cesi-eat', 'livreur.*');
    
    console.log('Connecté à RabbitMQ');
    
    // Consommer les messages
    channel.consume('livreur-service-queue', async (data) => {
      const message = JSON.parse(data.content);
      console.log('Message reçu:', message);
      
      // Traiter le message selon son type
      switch (message.event) {
        case 'order.ready':
          // Rechercher un livreur disponible
          // Envoyer une notification au livreur
          break;
        case 'livreur.assigned':
          // Mettre à jour le statut du livreur
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
app.use('/api/livreurs', livreurRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Service livreur opérationnel' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Service livreur démarré sur le port ${PORT}`);
}); 