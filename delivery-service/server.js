const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
const PORT = 5003;

// Client service URL (from environment variable with fallback)
const CLIENT_SERVICE_URL = process.env.CLIENT_SERVICE_URL || 'http://client-service:5002';

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

// Routes with /orders prefix (accessed via /api/delivery/orders in frontend)
app.get('/orders/pending', async (req, res) => {
  try {
    console.log('Fetching pending orders from client service');
    console.log(`Using client service URL: ${CLIENT_SERVICE_URL}`);
    
    // Fetch pending orders from the client service instead of directly querying the DB
    try {
      const response = await axios.get(`${CLIENT_SERVICE_URL}/orders/pending`);
      console.log(`Retrieved ${response.data.length} pending orders`);
      res.json(response.data);
    } catch (axiosError) {
      console.error('Axios request to client service failed:', axiosError.message);
      if (axiosError.response) {
        console.error('Response status:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('No response received, request details:', axiosError.request._currentUrl);
      }
      
      // Attempt with complete URL as fallback
      try {
        console.log('Trying alternate URL format...');
        const fallbackResponse = await axios.get('http://client-service:5002/orders/pending');
        console.log(`Retrieved ${fallbackResponse.data.length} pending orders via fallback`);
        res.json(fallbackResponse.data);
      } catch (fallbackError) {
        console.error('Fallback request also failed:', fallbackError.message);
        throw new Error(`Failed to fetch orders: ${axiosError.message}`);
      }
    }
  } catch (error) {
    console.error('Error fetching pending orders:', error.message);
    res.status(500).json({ message: 'Failed to retrieve pending orders', error: error.message });
  }
});

app.post('/orders/:orderId/accept', async (req, res) => {
  const { deliveryPersonId } = req.body;
  const { orderId } = req.params;
  
  console.log(`Received request to accept order ${orderId} by delivery person ${deliveryPersonId}`);
  
  if (!deliveryPersonId) {
    console.log('Missing deliveryPersonId in request body');
    return res.status(400).json({ message: 'Delivery person ID is required' });
  }
  
  let client;
  
  try {
    // Connect to the database first
    client = await pool.connect();
    await client.query('BEGIN');
    
    // Check if the delivery person exists, create if not
    console.log(`Checking if delivery person ${deliveryPersonId} exists`);
    const deliveryPersonCheck = await client.query(
      `SELECT * FROM delivery_persons WHERE user_id = $1`,
      [deliveryPersonId]
    );
    
    if (deliveryPersonCheck.rows.length === 0) {
      console.log(`Delivery person ${deliveryPersonId} not found, creating a new record`);
      // Create a new delivery person entry with default values
      await client.query(
        `INSERT INTO delivery_persons 
          (user_id, name, phone, email, is_available, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [deliveryPersonId, 'Delivery Person', '000-000-0000', 'delivery@example.com', true, true]
      );
      console.log(`Created new delivery person record for ${deliveryPersonId}`);
    }
    
    // First, try to fetch the order from client service to validate it exists and is pending
    console.log(`Fetching order ${orderId} details from client service`);
    let orderResponse;
    try {
      // Try the environment variable URL first
      const clientServiceUrl = CLIENT_SERVICE_URL || 'http://client-service:5002';
      console.log(`Using client service URL: ${clientServiceUrl}/orders/${orderId}`);
      
      orderResponse = await axios.get(`${clientServiceUrl}/orders/${orderId}`);
      console.log(`Order ${orderId} fetched successfully:`, orderResponse.data.status);
    } catch (axiosError) {
      console.error(`Failed to fetch order ${orderId}:`, axiosError.message);
      
      if (axiosError.response) {
        console.error('Response status:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
      } else if (axiosError.request) {
        console.error('No response received, request details:', axiosError.request);
      }
      
      // Try a different approach - assume the order is valid and proceed
      console.log('Proceeding with order acceptance despite client service connectivity issues');
      
      // Create a mock order object to continue processing
      orderResponse = { 
        data: { 
          id: orderId, 
          status: 'pending', 
          restaurant_name: 'Unknown Restaurant', 
          delivery_address: 'Address will be provided by client' 
        } 
      };
    }
    
    const order = orderResponse.data;
    if (!order) {
      console.log(`Order ${orderId} not found`);
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order is already assigned to a delivery person
    console.log(`Checking if order ${orderId} is already assigned to a delivery person`);
    const orderCheckResult = await client.query(
      `SELECT * FROM deliveries WHERE order_id = $1`,
      [orderId]
    );
    
    if (orderCheckResult.rows.length > 0) {
      console.log(`Order ${orderId} is already assigned to delivery person ${orderCheckResult.rows[0].delivery_person_id}`);
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        message: 'This order is already assigned to a delivery person' 
      });
    }
    
    // Create a new delivery entry with simplified location data
    console.log(`Creating delivery entry for order ${orderId}`);
    const pickupLocation = JSON.stringify({ address: order.restaurant_name || 'Restaurant location' });
    const deliveryLocation = JSON.stringify({ address: order.delivery_address || 'Delivery location' });
    
    const deliveryResult = await client.query(
      `INSERT INTO deliveries 
        (order_id, delivery_person_id, status, pickup_location, delivery_location) 
       VALUES ($1, $2, 'accepted', $3, $4) 
       RETURNING *`,
      [orderId, deliveryPersonId, pickupLocation, deliveryLocation]
    );
    
    const deliveryId = deliveryResult.rows[0].id;
    console.log(`Created delivery entry with ID ${deliveryId}`);
    
    // Update the order status via client service API to waiting_restaurant_validation
    console.log(`Updating order ${orderId} status to 'waiting_restaurant_validation'`);
    try {
      await axios.patch(`${CLIENT_SERVICE_URL}/orders/${orderId}/status`, {
        status: 'waiting_restaurant_validation',
        delivery_id: deliveryPersonId
      });
      console.log(`Order ${orderId} status updated successfully to waiting_restaurant_validation`);
    } catch (updateError) {
      console.error(`Failed to update order ${orderId} status:`, updateError.message);
      console.log('Continuing despite error updating order status');
      // We'll continue despite this error - the delivery was created successfully
    }
    
    // Update delivery person availability
    console.log(`Updating delivery person ${deliveryPersonId} availability`);
    await client.query(
      `UPDATE delivery_persons 
       SET is_available = false, current_order_id = $1 
       WHERE user_id = $2`,
      [orderId, deliveryPersonId]
    );
    
    await client.query('COMMIT');
    console.log(`Order ${orderId} accepted successfully by delivery person ${deliveryPersonId}`);
    
    res.status(200).json({ 
      message: 'Order accepted successfully',
      delivery: deliveryResult.rows[0] 
    });
  } catch (error) {
    console.error(`Error accepting order ${orderId}:`, error.message);
    console.error(error.stack);
    
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError.message);
      }
    }
    res.status(500).json({ 
      message: 'Failed to accept order', 
      error: error.message 
    });
  } finally {
    if (client) {
      try {
        client.release();
      } catch (releaseError) {
        console.error('Error releasing client:', releaseError.message);
      }
    }
  }
});

app.post('/orders/:orderId/reject', async (req, res) => {
  const { deliveryPersonId, reason } = req.body;
  const { orderId } = req.params;
  
  console.log(`Received request to reject order ${orderId} by delivery person ${deliveryPersonId}`);
  
  if (!deliveryPersonId) {
    console.log('Missing deliveryPersonId in request body');
    return res.status(400).json({ message: 'Delivery person ID is required' });
  }
  
  let client;
  
  try {
    // Connect to the database first
    client = await pool.connect();
    await client.query('BEGIN');
    
    // Check if the delivery person exists, create if not
    console.log(`Checking if delivery person ${deliveryPersonId} exists`);
    const deliveryPersonCheck = await client.query(
      `SELECT * FROM delivery_persons WHERE user_id = $1`,
      [deliveryPersonId]
    );
    
    if (deliveryPersonCheck.rows.length === 0) {
      console.log(`Delivery person ${deliveryPersonId} not found, creating a new record`);
      // Create a new delivery person entry with default values
      await client.query(
        `INSERT INTO delivery_persons 
          (user_id, name, phone, email, is_available, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [deliveryPersonId, 'Delivery Person', '000-000-0000', 'delivery@example.com', true, true]
      );
      console.log(`Created new delivery person record for ${deliveryPersonId}`);
    }
    
    // Check if this delivery person already has this order
    const deliveryCheck = await client.query(
      `SELECT * FROM deliveries WHERE order_id = $1 AND delivery_person_id = $2`,
      [orderId, deliveryPersonId]
    );
    
    // If the delivery person has already accepted this order, cancel it
    if (deliveryCheck.rows.length > 0) {
      await client.query(
        `UPDATE deliveries SET status = 'cancelled', 
         rejection_reason = $1, 
         updated_at = NOW() 
         WHERE id = $2`,
        [reason || 'Rejected by delivery person', deliveryCheck.rows[0].id]
      );
    }
    
    // Add a record of the rejection even if they hadn't accepted it yet
    if (deliveryCheck.rows.length === 0) {
      console.log(`Creating rejected delivery record for order ${orderId}`);
      await client.query(
        `INSERT INTO deliveries 
          (order_id, delivery_person_id, status, rejection_reason, 
           pickup_location, delivery_location) 
         VALUES ($1, $2, 'rejected', $3, $4, $5)`,
        [
          orderId, 
          deliveryPersonId, 
          reason || 'Rejected by delivery person',
          JSON.stringify({ address: 'Unknown restaurant' }),
          JSON.stringify({ address: 'Unknown delivery address' })
        ]
      );
    }
    
    // Update the order status via client service API
    try {
      await axios.patch(`${CLIENT_SERVICE_URL}/orders/${orderId}/status`, {
        status: 'pending'  // Keep it as pending so other delivery people can accept it
      });
      console.log(`Order ${orderId} status updated back to pending`);
    } catch (updateError) {
      console.error(`Failed to update order ${orderId} status:`, updateError.message);
      console.log('Continuing despite error updating order status');
    }
    
    // If the delivery person was assigned to this order, free them up
    await client.query(
      `UPDATE delivery_persons 
       SET is_available = true, current_order_id = NULL 
       WHERE user_id = $1 AND current_order_id = $2`,
      [deliveryPersonId, orderId]
    );
    
    await client.query('COMMIT');
    console.log(`Order ${orderId} rejected successfully by delivery person ${deliveryPersonId}`);
    
    res.status(200).json({ message: 'Order rejected successfully' });
  } catch (error) {
    console.error(`Error rejecting order ${orderId}:`, error.message);
    console.error(error.stack);
    
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError.message);
      }
    }
    res.status(500).json({ 
      message: 'Failed to reject order', 
      error: error.message 
    });
  } finally {
    if (client) {
      try {
        client.release();
      } catch (releaseError) {
        console.error('Error releasing client:', releaseError.message);
      }
    }
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Optional: Check database connection health
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'UP',
      database: pool.totalCount > 0 ? 'CONNECTED' : 'CONNECTING',
      serviceVersion: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', db_status: 'disconnected', error: error.message });
  }
});

// Diagnostic endpoint for checking delivery person acceptance
app.get('/diagnostic', (req, res) => {
  const authHeader = req.headers.authorization;
  
  res.status(200).json({
    message: 'Delivery service diagnostic endpoint',
    timestamp: new Date().toISOString(),
    headers: {
      authorization: authHeader ? 'Present' : 'Missing',
      host: req.headers.host,
      origin: req.headers.origin
    },
    clientServiceUrl: CLIENT_SERVICE_URL
  });
});

// Test client service connectivity endpoint
app.get('/test-client-connectivity', async (req, res) => {
  try {
    console.log('Testing connectivity to client service...');
    const response = await axios.get(`${CLIENT_SERVICE_URL}/health`);
    console.log('Client service connectivity test successful:', response.data);
    res.status(200).json({
      status: 'SUCCESS',
      clientServiceResponse: response.data,
      clientServiceUrl: CLIENT_SERVICE_URL
    });
  } catch (error) {
    console.error('Error testing client service connectivity:', error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to connect to client service',
      error: error.message,
      clientServiceUrl: CLIENT_SERVICE_URL
    });
  }
});

app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});