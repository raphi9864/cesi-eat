const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 5003;

// Middleware
app.use(cors());
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
    console.log('Connected to Delivery Database at:', res.rows[0].now);
  }
});

// Routes

// Delivery Person Routes
app.post('/delivery-persons', async (req, res) => {
  const { 
    userId, name, phone, email, isAvailable = false, 
    isActive = true, currentLocation = null
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO delivery_persons 
        (user_id, name, phone, email, is_available, is_active, current_location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, name, phone, email, isAvailable, isActive, 
       currentLocation ? JSON.stringify(currentLocation) : null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/delivery-persons/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM delivery_persons WHERE user_id = $1', [req.params.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/delivery-persons', async (req, res) => {
  try {
    const { available } = req.query;
    let query = 'SELECT * FROM delivery_persons';
    
    if (available === 'true') {
      query += ' WHERE is_available = true AND is_active = true';
    }
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/delivery-persons/:userId/status', async (req, res) => {
  const { isAvailable, currentLocation } = req.body;
  
  try {
    let query = 'UPDATE delivery_persons SET ';
    const queryParams = [];
    const queryValues = [];
    
    if (isAvailable !== undefined) {
      queryParams.push('is_available = $' + (queryValues.length + 1));
      queryValues.push(isAvailable);
    }
    
    if (currentLocation) {
      queryParams.push('current_location = $' + (queryValues.length + 1));
      queryValues.push(JSON.stringify({
        ...currentLocation,
        lastUpdated: new Date()
      }));
    }
    
    if (queryParams.length === 0) {
      return res.status(400).json({ message: 'No update parameters provided' });
    }
    
    query += queryParams.join(', ');
    query += ' WHERE user_id = $' + (queryValues.length + 1);
    queryValues.push(req.params.userId);
    query += ' RETURNING *';
    
    const result = await pool.query(query, queryValues);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery person not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Delivery Routes
app.post('/deliveries', async (req, res) => {
  const { 
    orderId, deliveryPersonId, pickupLocation, deliveryLocation,
    estimatedDeliveryTime
  } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const deliveryResult = await client.query(
      `INSERT INTO deliveries 
        (order_id, delivery_person_id, status, pickup_location, delivery_location, 
         estimated_delivery_time) 
       VALUES ($1, $2, 'assigned', $3, $4, $5) 
       RETURNING *`,
      [orderId, deliveryPersonId, 
       JSON.stringify(pickupLocation), JSON.stringify(deliveryLocation),
       estimatedDeliveryTime]
    );
    
    // Update delivery person status
    await client.query(
      `UPDATE delivery_persons 
       SET is_available = false, current_order_id = $1 
       WHERE user_id = $2`,
      [orderId, deliveryPersonId]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json(deliveryResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
});

app.get('/deliveries/order/:orderId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deliveries WHERE order_id = $1', [req.params.orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/deliveries/person/:deliveryPersonId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM deliveries 
       WHERE delivery_person_id = $1 AND status != 'delivered' 
       ORDER BY assigned_at DESC`,
      [req.params.deliveryPersonId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/deliveries/:id/status', async (req, res) => {
  const { status } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    let updateQuery = 'UPDATE deliveries SET status = $1';
    const queryParams = [status];
    
    // Add timestamps based on status
    if (status === 'picked-up') {
      updateQuery += ', picked_up_at = NOW()';
    } else if (status === 'delivered') {
      updateQuery += ', delivered_at = NOW()';
      
      // Get delivery record
      const deliveryResult = await client.query(
        'SELECT * FROM deliveries WHERE id = $1',
        [req.params.id]
      );
      
      if (deliveryResult.rows.length > 0) {
        // Free up delivery person
        await client.query(
          `UPDATE delivery_persons 
           SET is_available = true, current_order_id = NULL 
           WHERE user_id = $1`,
          [deliveryResult.rows[0].delivery_person_id]
        );
      }
    }
    
    updateQuery += ' WHERE id = $2 RETURNING *';
    queryParams.push(req.params.id);
    
    const result = await client.query(updateQuery, queryParams);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});