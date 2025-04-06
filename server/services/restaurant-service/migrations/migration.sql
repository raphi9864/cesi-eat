-- Restaurant Service Migration File

-- Clear existing data if needed (Be careful with this in production!)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Restaurants;
TRUNCATE TABLE Dishes;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert sample restaurants from data.js
INSERT INTO Restaurants 
(nom, description, rue, ville, codePostal, pays, telephone, email, categories, horaires, image, note, nombreAvis, proprietaireId, statut, tempsLivraisonEstime, fraisLivraison, commandeMinimum, createdAt, updatedAt)
VALUES
-- Existing restaurants
('Pizzeria Napoli', 'Authentiques pizzas napolitaines cuites au feu de bois', '12 Rue des Italiens', 'Paris', '75002', 'France', '0145789632', 'contact@napoli.fr', 
  JSON_ARRAY('Italien', 'Pizza', 'Méditerranéen'),
  JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:30'),
               'mardi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:30'),
               'mercredi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:30'),
               'jeudi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '22:30'),
               'vendredi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:30'),
               'samedi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:30'),
               'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '22:00')),
  'napoli.jpg', 4.7, 128, 'rest-101', 'ouvert', 30, 2.50, 15.00, NOW(), NOW()),

('Sushi Sakura', 'Sushi et spécialités japonaises préparés avec des ingrédients frais', '8 Avenue Montaigne', 'Paris', '75008', 'France', '0156423698', 'info@sakura.fr',
  JSON_ARRAY('Japonais', 'Sushi', 'Asiatique'),
  JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
               'mardi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
               'mercredi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
               'jeudi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '22:00'),
               'vendredi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '23:00'),
               'samedi', JSON_OBJECT('ouverture', '11:00', 'fermeture', '23:00'),
               'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '21:30')),
  'sakura.jpg', 4.5, 96, 'rest-102', 'ouvert', 35, 3.00, 20.00, NOW(), NOW()),

('Burger Deluxe', 'Les meilleurs burgers gourmet de la ville', '45 Rue Oberkampf', 'Paris', '75011', 'France', '0178965421', 'hello@burgerdeluxe.fr',
  JSON_ARRAY('Américain', 'Burger', 'Fast Food'),
  JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:00'),
               'mardi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:00'),
               'mercredi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:00'),
               'jeudi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '23:00'),
               'vendredi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '00:00'),
               'samedi', JSON_OBJECT('ouverture', '11:30', 'fermeture', '00:00'),
               'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '22:30')),
  'burger.jpg', 4.2, 155, 'rest-103', 'ouvert', 25, 2.00, 12.00, NOW(), NOW()),

('Le Bistrot Français', 'Cuisine traditionnelle française dans un cadre élégant', '28 Rue Saint-Dominique', 'Paris', '75007', 'France', '0142658974', 'contact@bistrotfrancais.fr',
  JSON_ARRAY('Français', 'Gastronomique', 'Traditionnel'),
  JSON_OBJECT('lundi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30'),
               'mardi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'mercredi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'jeudi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'vendredi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '23:00'),
               'samedi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '23:00'),
               'dimanche', JSON_OBJECT('ouverture', '12:00', 'fermeture', '15:00')),
  'bistrot.jpg', 4.8, 87, 'rest-104', 'ouvert', 45, 5.00, 25.00, NOW(), NOW()),

('Thai Spices', 'Saveurs authentiques de Thaïlande', '3 Rue de la Roquette', 'Paris', '75011', 'France', '0165324789', 'bonjour@thaispices.fr',
  JSON_ARRAY('Thaïlandais', 'Asiatique', 'Épicé'),
  JSON_OBJECT('lundi', JSON_OBJECT('ouverture', 'fermé', 'fermeture', 'fermé'),
               'mardi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'mercredi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'jeudi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'vendredi', JSON_OBJECT('ouverture', '12:00', 'fermeture', '14:30', 'ouverture2', '19:00', 'fermeture2', '22:30'),
               'samedi', JSON_OBJECT('ouverture', '19:00', 'fermeture', '23:00'),
               'dimanche', JSON_OBJECT('ouverture', '19:00', 'fermeture', '22:30')),
  'thai.jpg', 4.4, 72, 'rest-105', 'ouvert', 40, 4.00, 18.00, NOW(), NOW()),

-- Nouveaux restaurants du data.js
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
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543', 4.6, 85, 'rest-109', 'ouvert', 30, 2.49, 12.00, NOW(), NOW());

-- Insert sample dishes
INSERT INTO Dishes 
(nom, description, prix, image, categorie, options, disponible, allergenes, estVegetarien, estVegan, restaurantId, createdAt, updatedAt)
VALUES 
-- Existing dishes
('Margherita', 'Tomate, mozzarella, basilic frais, huile d\'olive', 10.50, 'margherita.jpg', 'Pizza', 
  JSON_OBJECT('taille', JSON_ARRAY('Moyenne', 'Grande')), 
  true, 
  JSON_ARRAY('Gluten', 'Lactose'), 
  true, false, 1, NOW(), NOW()),

('Quatre Fromages', 'Tomate, mozzarella, gorgonzola, pecorino, parmesan', 13.50, 'quattro-formaggi.jpg', 'Pizza', 
  JSON_OBJECT('taille', JSON_ARRAY('Moyenne', 'Grande')), 
  true, 
  JSON_ARRAY('Gluten', 'Lactose'), 
  true, false, 1, NOW(), NOW()),

('Calzone', 'Pizza pliée avec mozzarella, jambon, champignons, œuf', 14.00, 'calzone.jpg', 'Pizza', 
  NULL, 
  true, 
  JSON_ARRAY('Gluten', 'Lactose', 'Œuf'), 
  false, false, 1, NOW(), NOW()),

-- Sushi Sakura dishes
('Assortiment Sushi', '18 pièces : nigiri, maki et california rolls', 24.50, 'assortiment-sushi.jpg', 'Sushi', 
  NULL, 
  true, 
  JSON_ARRAY('Poisson', 'Soja', 'Sésame'), 
  false, false, 2, NOW(), NOW()),

('Sashimi Saumon', 'Tranches de saumon cru frais, wasabi et gingembre', 16.90, 'sashimi.jpg', 'Sashimi', 
  NULL, 
  true, 
  JSON_ARRAY('Poisson'), 
  false, false, 2, NOW(), NOW()),

('Maki Végétarien', 'Avocat, concombre, carotte, radis', 12.50, 'maki-vege.jpg', 'Maki', 
  NULL, 
  true, 
  JSON_ARRAY('Soja', 'Sésame'), 
  true, true, 2, NOW(), NOW()),

-- Burger Deluxe dishes
('Classic Deluxe', 'Bœuf 180g, cheddar, bacon, salade, tomate, sauce secrète', 14.90, 'classic-deluxe.jpg', 'Burger', 
  JSON_OBJECT('cuisson', JSON_ARRAY('Saignant', 'À point', 'Bien cuit'), 'accompagnement', JSON_ARRAY('Frites', 'Salade')), 
  true, 
  JSON_ARRAY('Gluten', 'Lactose', 'Œuf'), 
  false, false, 3, NOW(), NOW()),

('Veggie Burger', 'Galette de légumes, fromage de chèvre, roquette, tomate confite', 13.50, 'veggie-burger.jpg', 'Burger', 
  JSON_OBJECT('accompagnement', JSON_ARRAY('Frites', 'Salade')), 
  true, 
  JSON_ARRAY('Gluten', 'Lactose'), 
  true, false, 3, NOW(), NOW()),

('Frites Maison', 'Pommes de terre fraîches coupées à la main', 4.50, 'frites.jpg', 'Accompagnement', 
  JSON_OBJECT('taille', JSON_ARRAY('Petite', 'Grande')), 
  true, 
  NULL, 
  true, true, 3, NOW(), NOW()),

-- Le Bistrot Français dishes
('Bœuf Bourguignon', 'Mijoté de bœuf au vin rouge, lardons, champignons et carottes', 19.80, 'boeuf-bourguignon.jpg', 'Plat', 
  NULL, 
  true, 
  NULL, 
  false, false, 4, NOW(), NOW()),

('Canard Confit', 'Cuisse de canard confite, pommes sarladaises', 22.50, 'canard-confit.jpg', 'Plat', 
  NULL, 
  true, 
  NULL, 
  false, false, 4, NOW(), NOW()),

('Tarte Tatin', 'Tarte aux pommes caramélisées, crème fraîche', 8.50, 'tarte-tatin.jpg', 'Dessert', 
  NULL, 
  true, 
  JSON_ARRAY('Gluten', 'Lactose'), 
  true, false, 4, NOW(), NOW()),

-- Thai Spices dishes
('Pad Thai', 'Nouilles de riz sautées aux crevettes, tofu, cacahuètes et germes de soja', 15.90, 'pad-thai.jpg', 'Plat', 
  JSON_OBJECT('épice', JSON_ARRAY('Doux', 'Moyen', 'Épicé')), 
  true, 
  JSON_ARRAY('Fruits de mer', 'Cacahuètes', 'Soja'), 
  false, false, 5, NOW(), NOW()),

('Curry Vert', 'Curry vert au lait de coco avec poulet et légumes', 16.50, 'curry-vert.jpg', 'Plat', 
  JSON_OBJECT('épice', JSON_ARRAY('Doux', 'Moyen', 'Épicé')),  
  true, 
  NULL, 
  false, false, 5, NOW(), NOW()),

('Salade de Papaye Verte', 'Papaye verte râpée, tomates cerises, haricots verts, cacahuètes', 9.90, 'salade-papaye.jpg', 'Entrée', 
  JSON_OBJECT('épice', JSON_ARRAY('Doux', 'Moyen', 'Épicé')), 
  true, 
  JSON_ARRAY('Cacahuètes'), 
  true, true, 5, NOW(), NOW()),
  
-- Nouveaux plats pour Sushi Express (du data.js)
('Salmon Nigiri', 'Fresh salmon over pressed vinegar rice', 8.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Sushi', 
  NULL, 
  true, 
  JSON_ARRAY('Poisson', 'Soja'), 
  false, false, 6, NOW(), NOW()),

('California Roll', 'Crab, avocado, cucumber, sesame seeds', 7.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Maki', 
  NULL,
  true, 
  JSON_ARRAY('Fruits de mer', 'Soja', 'Sésame'), 
  false, false, 6, NOW(), NOW()),

-- Plats pour Chez Pierre
('Coq au Vin', 'Chicken slow cooked in wine', 19.99, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092', 'Plat', 
  NULL, 
  true, 
  NULL, 
  false, false, 7, NOW(), NOW()),

('Ratatouille', 'Provençal vegetable stew', 14.99, 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c', 'Plat', 
  NULL, 
  true, 
  NULL, 
  true, true, 7, NOW(), NOW()),

-- Plats pour Tasty Treats
('Classic Burger', 'Beef patty, lettuce, tomato, cheese', 9.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Burger', 
  JSON_OBJECT('cuisson', JSON_ARRAY('Medium Rare', 'Medium', 'Well Done')), 
  true, 
  JSON_ARRAY('Gluten', 'Lactose'), 
  false, false, 8, NOW(), NOW()),

('Mac & Cheese', 'Creamy cheese sauce with elbow macaroni', 7.99, 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7', 'Plat', 
  NULL, 
  true, 
  JSON_ARRAY('Gluten', 'Lactose'), 
  true, false, 8, NOW(), NOW()),

-- Plats pour Delicious Dishes
('Pad Thai', 'Rice noodles, eggs, tofu, bean sprouts, peanuts', 11.99, 'https://images.unsplash.com/photo-1559314809-0d155014e29e', 'Plat', 
  JSON_OBJECT('épice', JSON_ARRAY('Mild', 'Medium', 'Spicy')), 
  true, 
  JSON_ARRAY('Œuf', 'Soja', 'Cacahuètes'), 
  true, false, 9, NOW(), NOW()),

('Cappuccino', 'Espresso with steamed milk and foam', 3.99, 'https://images.unsplash.com/photo-1534778101976-62847782c213', 'Boisson', 
  NULL, 
  true, 
  JSON_ARRAY('Lactose'), 
  true, false, 9, NOW(), NOW()); 