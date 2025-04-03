const mysql = require('mysql2/promise');
require('dotenv').config();

async function waitForDatabase(attempts = 30, delay = 2000) {
  let currentAttempt = 0;
  
  while (currentAttempt < attempts) {
    try {
      console.log(`Attempt ${currentAttempt + 1}/${attempts} - Connecting to database...`);
      
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      });
      
      // Test the connection
      await connection.query('SELECT 1');
      
      // Check if database exists
      const [rows] = await connection.query(`
        SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?
      `, [process.env.DB_NAME]);
      
      // If database doesn't exist, create it
      if (rows.length === 0) {
        console.log(`Database ${process.env.DB_NAME} not found. Creating...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created successfully.`);
      }
      
      // Close the connection
      await connection.end();
      
      console.log('Database connection successful!');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error.message);
      
      // Wait before next attempt
      currentAttempt++;
      if (currentAttempt < attempts) {
        console.log(`Waiting ${delay/1000} seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`Failed to connect to database after ${attempts} attempts.`);
  return false;
}

// Run if called directly
if (require.main === module) {
  waitForDatabase()
    .then(success => {
      if (success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
} else {
  // Export if imported as a module
  module.exports = { waitForDatabase };
} 