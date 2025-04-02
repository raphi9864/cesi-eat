require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Configuration des proxies pour chaque service
const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api'
  }
});

const restaurantServiceProxy = createProxyMiddleware({
  target: process.env.RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/restaurants': '/api'
  }
});

const orderServiceProxy = createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/api'
  }
});

const livreurServiceProxy = createProxyMiddleware({
  target: process.env.LIVREUR_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/livreurs': '/api'
  }
});

// Routes publiques (sans authentification)
app.use('/api/users/auth', userServiceProxy); // Login et Register
app.use('/api/restaurants/public', restaurantServiceProxy); // Liste des restaurants publique

// Routes protégées (avec authentification)
app.use('/api/users', verifyToken, userServiceProxy);
app.use('/api/restaurants', verifyToken, restaurantServiceProxy);
app.use('/api/orders', verifyToken, orderServiceProxy);
app.use('/api/livreurs', verifyToken, livreurServiceProxy);

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
});
