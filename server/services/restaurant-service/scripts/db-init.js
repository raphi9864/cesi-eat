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
    // Force re-initialization of data if environment variable is set
    const forceInit = process.env.FORCE_DB_INIT === 'true';
    
    // Check if tables already have data (only if not forcing init)
    if (!forceInit) {
      try {
        const [restaurantRows] = await connection.query('SELECT COUNT(*) as count FROM Restaurants');
        if (restaurantRows[0].count > 0) {
          console.log('Database already contains data. Skipping initialization.');
          return true;
        }
      } catch (tableError) {
        // If error is because tables don't exist yet, it's fine - they'll be created
        if (tableError.code === 'ER_NO_SUCH_TABLE') {
          console.log('Tables do not exist yet. They will be created by Sequelize.');
        } else {
          throw tableError;
        }
      }
    } else {
      console.log('Force initialization enabled. Resetting and loading fresh data...');
    }
    
    // Ensure database schema is ready
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Restaurants (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        rue VARCHAR(255),
        ville VARCHAR(255),
        codePostal VARCHAR(20),
        pays VARCHAR(100),
        telephone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        categories JSON,
        horaires JSON,
        image VARCHAR(255) DEFAULT 'default-restaurant.jpg',
        note FLOAT DEFAULT 0,
        nombreAvis INT DEFAULT 0,
        proprietaireId VARCHAR(100) NOT NULL,
        statut ENUM('ouvert', 'fermé', 'en_pause') DEFAULT 'fermé',
        tempsLivraisonEstime INT NOT NULL,
        fraisLivraison FLOAT NOT NULL,
        commandeMinimum FLOAT NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Dishes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        prix FLOAT NOT NULL,
        image VARCHAR(255) DEFAULT 'default-dish.jpg',
        categorie VARCHAR(100) NOT NULL,
        options JSON,
        disponible BOOLEAN DEFAULT true,
        allergenes JSON,
        estVegetarien BOOLEAN DEFAULT false,
        estVegan BOOLEAN DEFAULT false,
        restaurantId INT NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME,
        FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON DELETE CASCADE
      )
    `);
    
    // Read SQL file
    const migrationPath = path.join(__dirname, '../migrations/migration.sql');
    const sqlScript = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute SQL
    console.log('Running migration script...');
    await connection.query(sqlScript);
    console.log('Database initialization completed successfully!');
    return true;
  } catch (error) {
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