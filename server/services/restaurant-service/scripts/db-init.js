const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();
const { waitForDatabase } = require('./wait-for-db');

async function initializeDatabase() {
  console.log('Initializing database...');
  
  // First ensure database exists and is accessible
  const dbReady = await waitForDatabase();
  if (!dbReady) {
    console.error('Could not connect to database, aborting initialization');
    return false;
  }
  
  // Create connection to the specific database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true // Allow multiple SQL statements
  });
  
  try {
    // Check if tables already have data
    const [restaurantRows] = await connection.query('SELECT COUNT(*) as count FROM Restaurants');
    if (restaurantRows[0].count > 0) {
      console.log('Database already contains data. Skipping initialization.');
      return true;
    }
    
    // Read SQL file
    const migrationPath = path.join(__dirname, '../migrations/migration.sql');
    const sqlScript = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute SQL
    console.log('Running migration script...');
    await connection.query(sqlScript);
    console.log('Database initialization completed successfully!');
    return true;
  } catch (error) {
    // If error is because tables don't exist yet, it's fine - they'll be created
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('Tables do not exist yet. They will be created by Sequelize.');
      return true;
    }
    console.error('Error initializing database:', error);
    return false;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      if (success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Initialization failed:', err);
      process.exit(1);
    });
} else {
  // Export if imported as a module
  module.exports = { initializeDatabase }; 
} 