const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 5002;

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
    console.log('Connected to Client Database at:', res.rows[0].now);
  }
});

// Define order statuses for validation
const validOrderStatuses = [
  'pending', 
  'waiting_restaurant_validation', 
  'processing', 
  'ready_for_pickup', 
  'on_delivery', 
  'delivered', 
  'cancelled'
];

// Routes

// Client Profile Routes
app.post('/profiles', async (req, res) => {
  const { 
    userId, name, address, phone, savedAddresses 
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO client_profiles 
        (user_id, name, address, phone, saved_addresses) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, name, address, phone, JSON.stringify(savedAddresses || [])]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/profiles/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM client_profiles WHERE user_id = $1', [req.params.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client profile not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/profiles/:userId', async (req, res) => {
  const { 
    name, address, phone, savedAddresses 
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE client_profiles 
       SET name = $1, address = $2, phone = $3, saved_addresses = $4
       WHERE user_id = $5 
       RETURNING *`,
      [name, address, phone, JSON.stringify(savedAddresses || []), req.params.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client profile not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Order Routes
app.post('/orders', async (req, res) => {
  const { 
    clientId, restaurantId, restaurantName, items, 
    totalPrice, deliveryAddress, deliveryNotes, paymentMethod 
  } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create the order
    const orderResult = await client.query(
      `INSERT INTO orders 
        (client_id, restaurant_id, restaurant_name, total_price, delivery_address, 
         delivery_notes, payment_method, payment_status, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 'pending') 
       RETURNING *`,
      [clientId, restaurantId, restaurantName, totalPrice, deliveryAddress, 
       deliveryNotes, paymentMethod]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Add order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items 
          (order_id, dish_id, name, price, quantity) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.dishId, item.name, item.price, item.quantity]
      );
    }
    
    await client.query('COMMIT');
    
    // Retrieve the full order with items
    const fullOrderResult = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(i) FROM order_items i WHERE i.order_id = o.id) as items 
       FROM orders o 
       WHERE o.id = $1`,
      [orderId]
    );
    
    res.status(201).json(fullOrderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.get('/orders/client/:clientId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(i) FROM order_items i WHERE i.order_id = o.id) as items 
       FROM orders o 
       WHERE o.client_id = $1 
       ORDER BY o.created_at DESC`,
      [req.params.clientId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/orders/restaurant/:restaurantId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(i) FROM order_items i WHERE i.order_id = o.id) as items 
       FROM orders o 
       WHERE o.restaurant_id = $1 
       ORDER BY o.created_at DESC`,
      [req.params.restaurantId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all pending orders (for delivery assignment)
// This route needs to be defined BEFORE the /:orderId route to avoid conflicts
app.get('/orders/pending', async (req, res) => {
  try {
    console.log('Client service: Received request for pending orders');
    
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT COALESCE(json_agg(i), '[]'::json) FROM order_items i WHERE i.order_id = o.id) as items 
       FROM orders o 
       WHERE o.status = 'pending' AND o.delivery_id IS NULL 
       ORDER BY o.created_at ASC`
    );
    
    console.log(`Client service: Found ${result.rows.length} pending orders`);
    
    // Ensure we always return an array
    res.json(result.rows || []);
  } catch (error) {
    console.error('Client service - Error fetching pending orders:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/orders/:orderId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(i) FROM order_items i WHERE i.order_id = o.id) as items 
       FROM orders o 
       WHERE o.id = $1`,
      [req.params.orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/orders/delivery/:deliveryId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(i) FROM order_items i WHERE i.order_id = o.id) as items 
       FROM orders o 
       WHERE o.delivery_id = $1 
       ORDER BY o.created_at DESC`,
      [req.params.deliveryId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/orders/:orderId/status', async (req, res) => {
  const { status, delivery_id } = req.body;
  
  try {
    // Validate status
    if (!validOrderStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status value. Must be one of: ${validOrderStatuses.join(', ')}` 
      });
    }
    
    let updateQuery = 'UPDATE orders SET status = $1';
    const queryParams = [status];
    let paramIndex = 2;
    
    // If delivery_id is provided, update that field too
    if (delivery_id !== undefined) {
      updateQuery += `, delivery_id = $${paramIndex}`;
      queryParams.push(delivery_id);
      paramIndex++;
    }
    
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    queryParams.push(req.params.orderId);
    
    const result = await pool.query(updateQuery, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Client service running on port ${PORT}`);
});