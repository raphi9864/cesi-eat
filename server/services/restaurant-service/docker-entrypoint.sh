#!/bin/sh
set -e

echo "===== Restaurant Service Initialization ====="

# S'assurer que le répertoire scripts existe
mkdir -p /app/scripts

# Copier les scripts d'initialisation
cat > /app/scripts/db-init.js << 'EOF'
const fs = require('fs');
const path = require('path');
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
    
    // Vérifier si les données existent déjà
    const [restaurantRows] = await connection.query('SELECT COUNT(*) as count FROM Restaurants');
    
    if (restaurantRows[0].count > 0) {
      console.log('Database already contains data. Checking if it needs update...');
      
      // Force reset tables for update
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      await connection.query('TRUNCATE TABLE Restaurants');
      await connection.query('TRUNCATE TABLE Dishes');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Existing data cleared, ready for fresh data...');
    }
    
    // Insérer les restaurants
    await connection.query(`
      INSERT INTO Restaurants 
      (nom, description, rue, ville, codePostal, pays, telephone, email, categories, horaires, image, note, nombreAvis, proprietaireId, statut, tempsLivraisonEstime, fraisLivraison, commandeMinimum, createdAt, updatedAt)
      VALUES
      ('Sushi Express', 'Authentic Japanese cuisine', '123 Sushi St', 'Los Angeles', '90001', 'USA', '+12345678901', 'contact@sushiexpress.com',
        JSON_ARRAY('Japonais', 'Sushi', 'Asiatique'),
        JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'mardi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'mercredi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'jeudi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'vendredi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '23:00'),
                     'samedi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '23:00'),
                     'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '21:00')),
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 4.7, 120, 'rest-106', 'ouvert', 35, 2.99, 15.00, NOW(), NOW()),
      
      ('Chez Pierre', 'Fine French dining', '456 French Ave', 'New York', '10001', 'USA', '+19876543210', 'contact@chezpierre.com',
        JSON_ARRAY('Français', 'Gastronomique'),
        JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '18:00', 'fermeture2', '22:00'),
                     'mardi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '18:00', 'fermeture2', '22:00'),
                     'mercredi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '18:00', 'fermeture2', '22:00'),
                     'jeudi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '18:00', 'fermeture2', '22:00'),
                     'vendredi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '18:00', 'fermeture2', '23:00'),
                     'samedi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '18:00', 'fermeture2', '23:00'),
                     'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '15:00')),
        'https://images.unsplash.com/photo-1600891964599-f61ba0e24092', 4.8, 95, 'rest-107', 'ouvert', 40, 3.99, 20.00, NOW(), NOW()),
      
      ('Tasty Treats', 'Homestyle American cooking', '789 Main St', 'Chicago', '60601', 'USA', '+15678901234', 'contact@tastytreats.com',
        JSON_ARRAY('Américain', 'Burger', 'Fast Food'),
        JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'mardi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'mercredi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'jeudi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
                     'vendredi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '23:00'),
                     'samedi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '23:00'),
                     'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '21:00')),
        'https://images.unsplash.com/photo-1565299507177-b0ac66763828', 4.5, 110, 'rest-108', 'ouvert', 25, 1.99, 10.00, NOW(), NOW()),
      
      ('Delicious Dishes', 'International cuisine', '101 Food Ave', 'Miami', '33101', 'USA', '+13456789012', 'contact@deliciousdishes.com',
        JSON_ARRAY('International', 'Fusion'),
        JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:00'),
                     'mardi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:00'),
                     'mercredi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:00'),
                     'jeudi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:00'),
                     'vendredi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:00'),
                     'samedi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:00'),
                     'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '21:30')),
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543', 4.6, 85, 'rest-109', 'ouvert', 30, 2.49, 12.00, NOW(), NOW())
    `);

    // Insérer les plats
    await connection.query(`
      INSERT INTO Dishes 
      (nom, description, prix, image, categorie, options, disponible, allergenes, estVegetarien, estVegan, restaurantId, createdAt, updatedAt)
      VALUES 
      -- Plats pour Sushi Express
      ('Salmon Nigiri', 'Fresh salmon over pressed vinegar rice', 8.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Sushi', 
        NULL, 
        true, 
        JSON_ARRAY('Poisson', 'Soja'), 
        false, false, 1, NOW(), NOW()),
      
      ('California Roll', 'Crab, avocado, cucumber, sesame seeds', 7.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Maki', 
        NULL,
        true, 
        JSON_ARRAY('Fruits de mer', 'Soja', 'Sésame'), 
        false, false, 1, NOW(), NOW()),
      
      -- Plats pour Chez Pierre
      ('Coq au Vin', 'Chicken slow cooked in wine', 19.99, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092', 'Plat', 
        NULL, 
        true, 
        NULL, 
        false, false, 2, NOW(), NOW()),
      
      ('Ratatouille', 'Provençal vegetable stew', 14.99, 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c', 'Plat', 
        NULL, 
        true, 
        NULL, 
        true, true, 2, NOW(), NOW()),
      
      -- Plats pour Tasty Treats
      ('Classic Burger', 'Beef patty, lettuce, tomato, cheese', 9.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Burger', 
        JSON_OBJECT('cuisson', JSON_ARRAY('Medium Rare', 'Medium', 'Well Done')), 
        true, 
        JSON_ARRAY('Gluten', 'Lactose'), 
        false, false, 3, NOW(), NOW()),
      
      ('Mac & Cheese', 'Creamy cheese sauce with elbow macaroni', 7.99, 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7', 'Plat', 
        NULL, 
        true, 
        JSON_ARRAY('Gluten', 'Lactose'), 
        true, false, 3, NOW(), NOW()),
      
      -- Plats pour Delicious Dishes
      ('Pad Thai', 'Rice noodles, eggs, tofu, bean sprouts, peanuts', 11.99, 'https://images.unsplash.com/photo-1559314809-0d155014e29e', 'Plat', 
        JSON_OBJECT('épice', JSON_ARRAY('Mild', 'Medium', 'Spicy')), 
        true, 
        JSON_ARRAY('Œuf', 'Soja', 'Cacahuètes'), 
        true, false, 4, NOW(), NOW()),
      
      ('Cappuccino', 'Espresso with steamed milk and foam', 3.99, 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Boisson', 
        NULL, 
        true, 
        JSON_ARRAY('Lactose'), 
        true, false, 4, NOW(), NOW())
    `);
    
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
initializeDatabase()
  .then(success => {
    if (success) {
      console.log('Database setup complete!');
    } else {
      console.error('Database setup failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Initialization failed:', err);
    process.exit(1);
  });
EOF

# Mettre à jour le fichier .env avec les informations de connexion MySQL
cat > /app/.env << 'EOF'
PORT=3002
MONGO_URI=mongodb://admin:password@mongodb:27017/cesi-eat-restaurant?authSource=admin
RABBITMQ_URI=amqp://cesi:cesi@rabbitmq:5672
JWT_SECRET=votre_secret_jwt
DB_HOST=mysql
DB_PORT=3306
DB_NAME=restaurant_db
DB_USER=restaurant_user
DB_PASSWORD=restaurant_password
FORCE_DB_INIT=true
EOF

# Attendre que MySQL soit disponible
echo "Waiting for MySQL to be available..."
sleep 5

# Installer mysql2 si nécessaire
if [ ! -d "/app/node_modules/mysql2" ]; then
  echo "Installing mysql2 package..."
  npm install mysql2 --save
fi

# Initialiser la base de données
echo "Creating database schema and loading restaurant data..."
node /app/scripts/db-init.js

# Démarrer le service
echo "Starting restaurant service..."
exec "$@" 