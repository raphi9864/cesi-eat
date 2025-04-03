-- Restaurant Service Migration File

-- Clear existing data if needed (Be careful with this in production!)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Restaurants;
TRUNCATE TABLE Dishes;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert sample restaurants
INSERT INTO Restaurants 
(nom, description, rue, ville, codePostal, pays, telephone, email, categories, horaires, image, note, nombreAvis, proprietaireId, statut, tempsLivraisonEstime, fraisLivraison, commandeMinimum, createdAt, updatedAt)
VALUES
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
  'thai.jpg', 4.4, 72, 'rest-105', 'ouvert', 40, 4.00, 18.00, NOW(), NOW());

-- Insert sample dishes
INSERT INTO Dishes 
(nom, description, prix, image, categorie, options, disponible, allergenes, estVegetarien, estVegan, restaurantId, createdAt, updatedAt)
VALUES 
-- Pizzeria Napoli dishes
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
  true, true, 5, NOW(), NOW()); 