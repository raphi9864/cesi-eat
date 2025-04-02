require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const amqp = require('amqplib');

const logRoutes = require('./routes/logs');
const Log = require('./models/Log');

const app = express();
const PORT = process.env.PORT || 3007;

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
async function connectQueue() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    
    // Déclarer les exchanges et queues nécessaires
    await channel.assertExchange('cesi-eat', 'topic', { durable: false });
    await channel.assertQueue('log-service-queue', { durable: false });
    
    // Binding des queues avec les routing keys appropriés
    await channel.bindQueue('log-service-queue', 'cesi-eat', '#'); // Écouter tous les événements
    
    console.log('Connecté à RabbitMQ');
    
    // Consommer les messages
    channel.consume('log-service-queue', async (data) => {
      try {
        const message = JSON.parse(data.content);
        const routingKey = data.fields.routingKey;
        
        // Déterminer le service et le niveau en fonction du routing key
        const [service, event] = routingKey.split('.');
        let level = 'info';
        
        if (event.includes('error') || event.includes('failed')) {
          level = 'error';
        } else if (event.includes('warning')) {
          level = 'warning';
        }

        // Créer le log
        await Log.createLog(
          service,
          level,
          `Event ${routingKey}: ${JSON.stringify(message)}`,
          message
        );

        channel.ack(data);
      } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
        channel.nack(data, false, false);
      }
    });
  } catch (error) {
    console.error('Erreur de connexion à RabbitMQ:', error);
  }
}

connectQueue();

// Routes
app.use('/api/logs', logRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Service log opérationnel' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Service log démarré sur le port ${PORT}`);
});