require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const verifyToken = require('./middleware/verifyToken');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS améliorée
const corsOptions = {
  origin: ['http://localhost', 'http://localhost:80', 'http://localhost:3000', 'http://cesi-eat-frontend'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Middleware pour vérifier les requêtes
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'}`);
  console.log(`[Headers] ${JSON.stringify(req.headers)}`);
  next();
});

// Fonction de debug pour les proxys
const debugProxy = (proxyName) => {
  return (req, res, next) => {
    console.log(`[DEBUG ${proxyName}] URL: ${req.url}, Method: ${req.method}, Target: ${process.env[`${proxyName.toUpperCase()}_SERVICE_URL`]}${req.url}`);
    next();
  };
};

// Configuration des proxies pour chaque service
const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api'
  }
});

// Configuration spécifique pour les restaurants publics
const restaurantPublicProxy = createProxyMiddleware({
  target: process.env.RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/restaurants/public': '/public'  // Rediriger vers /public sur le service restaurant
  }
});

const restaurantServiceProxy = createProxyMiddleware({
  target: process.env.RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/restaurants': '/api'
  }
});

// Routes publiques (sans authentification)
app.use('/api/users/auth', userServiceProxy); // Login et Register
app.use('/api/restaurants/public', restaurantPublicProxy); // Liste des restaurants publique

// Routes protégées
app.use('/api/users', verifyToken, userServiceProxy);
app.use('/api/restaurants', verifyToken, restaurantServiceProxy);
app.use('/api/orders', verifyToken, debugProxy('order'), createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {}
}));

app.use('/api/delivery', verifyToken, debugProxy('livreur'), createProxyMiddleware({
  target: process.env.LIVREUR_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {}
}));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API Gateway opérationnel' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`API Gateway démarré sur le port ${PORT}`);
  console.log(`CORS configuré pour accepter les requêtes depuis: ${corsOptions.origin.join(', ')}`);
});
