const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Auth Service Routes (no authentication required)
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/', 
  },
}));

// Restaurant Service Routes (make publicly accessible)
app.use('/api/restaurants', createProxyMiddleware({ 
  target: process.env.RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/restaurants': '/restaurants',
  },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[API Gateway] Original URL: ${req.originalUrl} | Method: ${req.method}`);
    console.log(`[API Gateway] Forwarding path to target: ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('[API Gateway] Proxy error:', err);
  }
}));

// Client Service Routes (with JWT Authentication)
app.use('/api/clients', authenticateJWT, createProxyMiddleware({ 
  target: process.env.CLIENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/clients': '/', 
  },
}));

// Delivery Service Routes (with JWT Authentication)
app.use('/api/delivery', authenticateJWT, createProxyMiddleware({ 
  target: process.env.DELIVERY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/delivery': '/', 
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on http://0.0.0.0:${PORT}`);
});