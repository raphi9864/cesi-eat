const express = require('express');
const { Pool } = require('pg'); // Use pg Pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from env
});

pool.connect()
  .then(() => console.log('Connected to Auth Database (PostgreSQL)'))
  .catch(err => console.error('Database connection error:', err));

// Routes
app.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body; // Using email as identifier

    // Check required fields
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    // Validate role
    const validRoles = ['client', 'restaurant', 'delivery'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }


    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in PostgreSQL
    const newUser = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Registration Error:', error); // Log the error
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

     // Check required fields
     if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Use id, email, role from Postgres
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
        // Add other non-sensitive user details if needed
      }
    });
  } catch (error) {
    console.error('Login Error:', error); // Log the error
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

app.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Optional: Check database connection health
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'UP', db_status: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', db_status: 'disconnected', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});