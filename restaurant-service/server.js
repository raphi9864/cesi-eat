const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to Restaurant Database at:', res.rows[0].now);
  }
});

// Routes

// Get all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get restaurant by ID with dishes
app.get('/restaurants/:id', async (req, res) => {
  try {
    // Fetch restaurant details
    const restaurantResult = await pool.query(
      `SELECT id, name, address, cuisine, images, rating, 
              review_count, description, delivery_time, delivery_fee, 
              opening_hours 
       FROM restaurants 
       WHERE id = $1`,
      [req.params.id]
    );
    
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Fetch restaurant's dishes
    const dishesResult = await pool.query(
      'SELECT id, name, description, price, image, category, is_available FROM dishes WHERE restaurant_id = $1',
      [req.params.id]
    );

    // Combine restaurant data with its dishes
    const restaurantData = {
      ...restaurantResult.rows[0],
      dishes: dishesResult.rows
    };
    
    res.json(restaurantData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get restaurant by user ID
app.get('/restaurants/user/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE user_id = $1', [req.params.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Create restaurant
app.post('/restaurants', async (req, res) => {
  const { 
    name, address, cuisine, userId, phone, email, 
    openingHours 
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO restaurants 
        (name, address, cuisine, user_id, phone, email, opening_hours) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, address, cuisine, userId, phone, email, JSON.stringify(openingHours)]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Update restaurant
app.put('/restaurants/:id', async (req, res) => {
  const { 
    name, address, cuisine, phone, email, 
    openingHours 
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE restaurants 
       SET name = $1, address = $2, cuisine = $3, phone = $4, email = $5, opening_hours = $6
       WHERE id = $7 
       RETURNING *`,
      [name, address, cuisine, phone, email, JSON.stringify(openingHours), req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Get dishes by restaurant ID
app.get('/restaurants/:id/dishes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dishes WHERE restaurant_id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Create dish
app.post('/dishes', async (req, res) => {
  const { 
    restaurantId, name, description, price, 
    image, category, isAvailable 
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO dishes 
        (restaurant_id, name, description, price, image, category, is_available) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [restaurantId, name, description, price, image, category, isAvailable]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Update dish
app.put('/dishes/:id', async (req, res) => {
  const { 
    name, description, price, image, 
    category, isAvailable 
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE dishes 
       SET name = $1, description = $2, price = $3, image = $4, category = $5, is_available = $6
       WHERE id = $7 
       RETURNING *`,
      [name, description, price, image, category, isAvailable, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Delete dish
app.delete('/dishes/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM dishes WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Order validation endpoint
app.post('/orders/:orderId/validate', async (req, res) => {
  const { orderId } = req.params;
  const { restaurantId } = req.body;
  
  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }
  
  try {
    // Make sure the restaurant exists
    const restaurantResult = await pool.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
    
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Update the order status via client service
    const clientServiceUrl = process.env.CLIENT_SERVICE_URL || 'http://client-service:5002';
    
    try {
      const response = await axios.patch(`${clientServiceUrl}/orders/${orderId}/status`, {
        status: 'processing'
      });
      
      res.status(200).json({
        message: 'Order validated successfully',
        order: response.data
      });
    } catch (error) {
      console.error('Error updating order status:', error.message);
      res.status(500).json({ 
        message: 'Failed to validate order',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error validating order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get pending orders for a restaurant that need validation
app.get('/restaurants/:restaurantId/pending-orders', async (req, res) => {
  const { restaurantId } = req.params;
  const clientServiceUrl = process.env.CLIENT_SERVICE_URL || 'http://client-service:5002';
  
  try {
    // Make sure the restaurant exists
    const restaurantResult = await pool.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
    
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Get orders from client service that are waiting for restaurant validation
    try {
      console.log(`Fetching orders for restaurant ${restaurantId} with status 'waiting_restaurant_validation'`);
      
      const response = await axios.get(`${clientServiceUrl}/orders/restaurant/${restaurantId}`);
      
      // Filter orders that are waiting for restaurant validation
      const pendingOrders = response.data.filter(order => 
        order.status === 'waiting_restaurant_validation'
      );
      
      console.log(`Found ${pendingOrders.length} orders waiting for restaurant validation`);
      res.json(pendingOrders);
    } catch (error) {
      console.error('Error fetching pending orders:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      res.status(500).json({ 
        message: 'Failed to fetch pending orders',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Accept an order (restaurant validation)
app.post('/restaurants/:restaurantId/orders/:orderId/accept', async (req, res) => {
  const { restaurantId, orderId } = req.params;
  const clientServiceUrl = process.env.CLIENT_SERVICE_URL || 'http://client-service:5002';
  
  try {
    // Make sure the restaurant exists
    const restaurantResult = await pool.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
    
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Get the order to verify it belongs to this restaurant and has the correct status
    try {
      const orderResponse = await axios.get(`${clientServiceUrl}/orders/${orderId}`);
      const order = orderResponse.data;
      
      if (order.restaurant_id !== parseInt(restaurantId)) {
        return res.status(403).json({ message: 'This order does not belong to this restaurant' });
      }
      
      if (order.status !== 'waiting_restaurant_validation') {
        return res.status(400).json({ 
          message: `Cannot accept this order. Current status: ${order.status}` 
        });
      }
      
      // Update the order status to processing
      const updateResponse = await axios.patch(`${clientServiceUrl}/orders/${orderId}/status`, {
        status: 'processing'
      });
      
      res.status(200).json({
        message: 'Order accepted successfully',
        order: updateResponse.data
      });
    } catch (error) {
      console.error('Error accepting order:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      res.status(500).json({ 
        message: 'Failed to accept order',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reject an order (restaurant rejection)
app.post('/restaurants/:restaurantId/orders/:orderId/reject', async (req, res) => {
  const { restaurantId, orderId } = req.params;
  const { reason } = req.body;
  const clientServiceUrl = process.env.CLIENT_SERVICE_URL || 'http://client-service:5002';
  
  try {
    // Make sure the restaurant exists
    const restaurantResult = await pool.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
    
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Get the order to verify it belongs to this restaurant and has the correct status
    try {
      const orderResponse = await axios.get(`${clientServiceUrl}/orders/${orderId}`);
      const order = orderResponse.data;
      
      if (order.restaurant_id !== parseInt(restaurantId)) {
        return res.status(403).json({ message: 'This order does not belong to this restaurant' });
      }
      
      if (order.status !== 'waiting_restaurant_validation') {
        return res.status(400).json({ 
          message: `Cannot reject this order. Current status: ${order.status}` 
        });
      }
      
      // Update the order status to cancelled
      const updateResponse = await axios.patch(`${clientServiceUrl}/orders/${orderId}/status`, {
        status: 'cancelled'
      });
      
      res.status(200).json({
        message: 'Order rejected successfully',
        order: updateResponse.data
      });
    } catch (error) {
      console.error('Error rejecting order:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      res.status(500).json({ 
        message: 'Failed to reject order',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark an order as ready for pickup
app.post('/restaurants/:restaurantId/orders/:orderId/ready', async (req, res) => {
  const { restaurantId, orderId } = req.params;
  const clientServiceUrl = process.env.CLIENT_SERVICE_URL || 'http://client-service:5002';
  
  try {
    // Make sure the restaurant exists
    const restaurantResult = await pool.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
    
    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Get the order to verify it belongs to this restaurant and has the correct status
    try {
      const orderResponse = await axios.get(`${clientServiceUrl}/orders/${orderId}`);
      const order = orderResponse.data;
      
      if (order.restaurant_id !== parseInt(restaurantId)) {
        return res.status(403).json({ message: 'This order does not belong to this restaurant' });
      }
      
      if (order.status !== 'processing') {
        return res.status(400).json({ 
          message: `Cannot mark this order as ready. Current status: ${order.status}` 
        });
      }
      
      // Update the order status to ready_for_pickup
      const updateResponse = await axios.patch(`${clientServiceUrl}/orders/${orderId}/status`, {
        status: 'ready_for_pickup'
      });
      
      res.status(200).json({
        message: 'Order marked as ready for pickup',
        order: updateResponse.data
      });
    } catch (error) {
      console.error('Error marking order as ready:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      res.status(500).json({ 
        message: 'Failed to mark order as ready',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});