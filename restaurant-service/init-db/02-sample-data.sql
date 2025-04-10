INSERT INTO restaurants (name, address, cuisine, user_id, phone, email, opening_hours, images, description, delivery_time, delivery_fee, rating, review_count)
VALUES
  (
    'Pizza Palace', 
    '123 Main St, Anytown', 
    'Italian', 
    'pizzapalace@example.com', 
    '555-123-4567', 
    'info@pizzapalace.com',
    '{
      "monday": {"open": "10:00", "close": "22:00"},
      "tuesday": {"open": "10:00", "close": "22:00"},
      "wednesday": {"open": "10:00", "close": "22:00"},
      "thursday": {"open": "10:00", "close": "22:00"},
      "friday": {"open": "10:00", "close": "23:00"},
      "saturday": {"open": "11:00", "close": "23:00"},
      "sunday": {"open": "11:00", "close": "22:00"}
    }',
    ARRAY['https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    'Authentic Italian cuisine in a cozy atmosphere',
    '30-45 min',
    2.99,
    4.2,
    185
  ),
  (
    'Burger Barn', 
    '456 Oak St, Someville', 
    'American', 
    'burgerbarn@example.com', 
    '555-987-6543', 
    'hello@burgerbarn.com',
    '{
      "monday": {"open": "11:00", "close": "21:00"},
      "tuesday": {"open": "11:00", "close": "21:00"},
      "wednesday": {"open": "11:00", "close": "21:00"},
      "thursday": {"open": "11:00", "close": "21:00"},
      "friday": {"open": "11:00", "close": "22:00"},
      "saturday": {"open": "11:00", "close": "22:00"},
      "sunday": {"open": "12:00", "close": "20:00"}
    }',
    ARRAY['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1098&q=80'],
    'Best burgers in town, made with 100% fresh beef',
    '20-35 min',
    3.99,
    4.5,
    320
  ),
  (
    'Sushi Spot', 
    '789 Pine St, Othertown', 
    'Japanese', 
    'sushispot@example.com', 
    '555-567-8901', 
    'contact@sushispot.com',
    '{
      "monday": {"open": "16:00", "close": "22:00"},
      "tuesday": {"open": "16:00", "close": "22:00"},
      "wednesday": {"open": "16:00", "close": "22:00"},
      "thursday": {"open": "16:00", "close": "22:00"},
      "friday": {"open": "16:00", "close": "23:00"},
      "saturday": {"open": "16:00", "close": "23:00"},
      "sunday": {"open": "16:00", "close": "22:00"}
    }',
    ARRAY['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    'Fresh and authentic Japanese sushi',
    '40-55 min',
    4.99,
    4.8,
    410
  );

-- Insert sample dishes for Pizza Palace
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (1, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80', 'Pizza'),
  (1, 'Pepperoni Pizza', 'Pizza with tomato sauce, mozzarella, and pepperoni', 14.99, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80', 'Pizza'),
  (1, 'Garden Salad', 'Fresh mixed greens with tomatoes, cucumbers, and house dressing', 7.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Salad'),
  (1, 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 4.99, 'https://images.unsplash.com/photo-1619981134266-5e6c4b3b9f1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Sides');

-- Insert sample dishes for Burger Barn
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (2, 'Classic Burger', 'Beef patty with lettuce, tomato, onion, and special sauce', 10.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1098&q=80', 'Burgers'),
  (2, 'Cheeseburger', 'Beef patty with American cheese, lettuce, tomato, and onion', 11.99, 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Burgers'),
  (2, 'Veggie Burger', 'Plant-based patty with lettuce, tomato, and avocado', 12.99, 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', 'Burgers'),
  (2, 'French Fries', 'Crispy golden fries with sea salt', 3.99, 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Sides'),
  (2, 'Onion Rings', 'Battered and fried onion rings', 4.99, 'https://images.unsplash.com/photo-1598245606797-360151f0a70a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Sides');

-- Insert sample dishes for Sushi Spot
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (3, 'California Roll', 'Crab, avocado, and cucumber roll', 7.99, 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80', 'Rolls'),
  (3, 'Spicy Tuna Roll', 'Spicy tuna and cucumber roll', 8.99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Rolls'),
  (3, 'Salmon Nigiri', 'Fresh salmon over pressed rice', 5.99, 'https://images.unsplash.com/photo-1611141647155-619159b0801d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Nigiri'),
  (3, 'Miso Soup', 'Traditional Japanese soybean soup with tofu and seaweed', 3.99, 'https://images.unsplash.com/photo-1604112908970-58e4e17c1e7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80', 'Soups'),
  (3, 'Edamame', 'Steamed soybean pods with sea salt', 4.99, 'https://images.unsplash.com/photo-1558860785-d36790f9b763?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Appetizers');

-- Insert 8 additional sample restaurants
INSERT INTO restaurants (name, address, cuisine, user_id, phone, email, opening_hours, images, description, delivery_time, delivery_fee, rating, review_count)
VALUES
  (
    'Taco Fiesta', 
    '101 Border Ave, Anytown', 
    'Mexican', 
    'rest4', 
    '555-111-2222', 
    'fiesta@taco.com',
    '{"workweek": {"open": "11:30", "close": "21:00"}, "weekend": {"open": "12:00", "close": "22:00"}}', 
    ARRAY['https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'],
    'Vibrant Mexican street food experience', 
    '25-40 min', 
    1.99,
    4.4,
    150
  ),
  (
    'Curry House', 
    '202 Spice Rd, Someville', 
    'Indian', 
    'rest5', 
    '555-222-3333', 
    'info@curryhouse.in',
    '{"all_days": {"open": "12:00", "close": "22:30"}}',
    ARRAY['https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1071&q=80'],
    'Authentic Indian curries and tandoori dishes', 
    '35-50 min', 
    3.49,
    4.7,
    280
  ),
  (
    'Vegan Vibes Cafe', 
    '303 Green Way, Othertown', 
    'Vegan', 
    'rest6', 
    '555-333-4444', 
    'veganvibes@cafe.com',
    '{"weekday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "10:00", "close": "16:00"}}',
    ARRAY['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    'Delicious and creative plant-based meals', 
    '30-45 min', 
    2.99,
    4.9,
    190
  ),
  (
    'Pasta Place', 
    '404 Noodle Blvd, Anytown', 
    'Italian', 
    'rest7', 
    '555-444-5555', 
    'pasta@place.it',
    '{"tue_sun": {"open": "17:00", "close": "22:00"}}',
    ARRAY['https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1057&q=80'],
    'Homemade pasta and classic Italian sauces', 
    '40-55 min', 
    3.99,
    4.6,
    220
  ),
  (
    'Thai Terrace', 
    '505 Orchid Ln, Someville', 
    'Thai', 
    'rest8', 
    '555-555-6666', 
    'thaisterrace@mail.com',
    '{"all_days": {"open": "11:00", "close": "21:30"}}',
    ARRAY['https://images.unsplash.com/photo-1569095079911-053853de96f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80'],
    'Exotic flavors of Thailand', 
    '30-45 min', 
    2.49,
    4.5,
    165
  ),
  (
    'BBQ Central', 
    '606 Smokey Ave, Othertown', 
    'BBQ', 
    'rest9', 
    '555-666-7777', 
    'bbq@central.com',
    '{"wed_sun": {"open": "12:00", "close": "20:00"}}',
    ARRAY['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'],
    'Slow-smoked BBQ ribs, brisket, and more', 
    '45-60 min', 
    4.49,
    4.8,
    310
  ),
  (
    'Seafood Shack', 
    '707 Ocean Dr, Anytown', 
    'Seafood', 
    'rest10', 
    '555-777-8888', 
    'info@seafoodshack.sea',
    '{"thu_sun": {"open": "15:00", "close": "21:00"}}',
    ARRAY['https://images.unsplash.com/photo-1559737558-549a5a71b64b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'],
    'Fresh catches and classic seafood platters', 
    '35-50 min', 
    5.99,
    4.3,
    115
  ),
  (
    'Mediterranean Delight', 
    '808 Olive St, Someville', 
    'Mediterranean', 
    'rest11', 
    '555-888-9999', 
    'delight@mediterranean.com',
    '{"all_days": {"open": "11:00", "close": "22:00"}}',
    ARRAY['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'],
    'Healthy and flavorful Mediterranean cuisine', 
    '25-40 min', 
    2.99,
    4.7,
    255
  );

-- Insert sample dishes for Taco Fiesta (ID 4)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (4, 'Chicken Tacos', 'Grilled chicken, onions, cilantro on corn tortillas', 9.99, 'https://images.unsplash.com/photo-1565299715199-866c917206bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80', 'Tacos'),
  (4, 'Beef Burrito', 'Seasoned ground beef, rice, beans, cheese wrapped in a flour tortilla', 11.99, 'https://images.unsplash.com/photo-1627435601361-ec25f2b7d8b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80', 'Burritos'),
  (4, 'Guacamole & Chips', 'Freshly made guacamole with crispy tortilla chips', 6.99, 'https://images.unsplash.com/photo-1548994795-25b04d78a11e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Appetizers');

-- Insert sample dishes for Curry House (ID 5)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (5, 'Chicken Tikka Masala', 'Grilled chicken in a creamy tomato sauce', 15.99, 'https://images.unsplash.com/photo-1631452180519-c0841145d849?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80', 'Curry'),
  (5, 'Vegetable Samosas', 'Crispy pastry filled with spiced potatoes and peas', 5.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Appetizers'),
  (5, 'Garlic Naan', 'Soft Indian flatbread with garlic', 3.99, 'https://images.unsplash.com/photo-1628543108325-10054c875960?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Breads');

-- Insert sample dishes for Vegan Vibes Cafe (ID 6)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (6, 'Quinoa Salad Bowl', 'Quinoa, mixed greens, avocado, chickpeas, lemon dressing', 12.99, 'https://images.unsplash.com/photo-1510629954389-c1e0da47d414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Salads'),
  (6, 'Lentil Soup', 'Hearty lentil soup with vegetables', 7.99, 'https://images.unsplash.com/photo-1620701701347-a591f661c3b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Soups'),
  (6, 'Avocado Toast', 'Smashed avocado on whole grain toast with seeds', 9.99, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Breakfast');

-- Insert sample dishes for Pasta Place (ID 7)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (7, 'Spaghetti Carbonara', 'Spaghetti with pancetta, egg, parmesan, and black pepper', 16.99, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80', 'Pasta'),
  (7, 'Lasagna Bolognese', 'Layered pasta with meat sauce, béchamel, and cheese', 18.99, 'https://images.unsplash.com/photo-1619895092598-14767781c1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Pasta'),
  (7, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99, 'https://images.unsplash.com/photo-1571877236404-e801a08e8939?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Desserts');

-- Insert sample dishes for Thai Terrace (ID 8)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (8, 'Pad Thai', 'Stir-fried rice noodles with shrimp, tofu, peanuts, and lime', 14.99, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=992&q=80', 'Noodles'),
  (8, 'Green Curry Chicken', 'Chicken in spicy green curry with coconut milk and vegetables', 15.99, 'https://images.unsplash.com/photo-1628428798066-69906fc95434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Curry'),
  (8, 'Mango Sticky Rice', 'Sweet sticky rice with fresh mango and coconut milk', 7.99, 'https://images.unsplash.com/photo-1553530688-4f17d6569619?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Desserts');

-- Insert sample dishes for BBQ Central (ID 9)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (9, 'BBQ Ribs (Half Rack)', 'Slow-smoked pork ribs with BBQ sauce', 19.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', 'BBQ'),
  (9, 'Pulled Pork Sandwich', 'Smoked pulled pork on a bun with coleslaw', 13.99, 'https://images.unsplash.com/photo-1619881590943-611c0b68b16c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Sandwiches'),
  (9, 'Mac & Cheese', 'Creamy baked macaroni and cheese', 6.99, 'https://images.unsplash.com/photo-1612182062596-5e6c4b3b9f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Sides');

-- Insert sample dishes for Seafood Shack (ID 10)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (10, 'Fish and Chips', 'Battered cod served with fries and tartar sauce', 17.99, 'https://images.unsplash.com/photo-1579887829287-1b95100c68b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Main'),
  (10, 'Grilled Salmon', 'Grilled salmon fillet with roasted vegetables', 22.99, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Main'),
  (10, 'Clam Chowder (Cup)', 'Creamy New England style clam chowder', 7.99, 'https://images.unsplash.com/photo-1542817809-15940575195a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=739&q=80', 'Soups');

-- Insert sample dishes for Mediterranean Delight (ID 11)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (11, 'Chicken Shawarma Plate', 'Marinated chicken shawarma served with rice, salad, and pita', 15.99, 'https://images.unsplash.com/photo-1604013129990-675199d8d97a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Plates'),
  (11, 'Falafel Wrap', 'Crispy falafel balls with hummus, tahini, and veggies in a pita', 11.99, 'https://images.unsplash.com/photo-1562802378-063ec186a725?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80', 'Wraps'),
  (11, 'Greek Salad', 'Tomatoes, cucumbers, olives, feta cheese, and Greek dressing', 9.99, 'https://images.unsplash.com/photo-1587437406329-7c84f93159e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Salads');