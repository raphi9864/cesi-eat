-- Insert sample restaurant data
INSERT INTO restaurants (name, address, cuisine, user_id, phone, email, opening_hours, images, description, delivery_time, delivery_fee, rating, review_count)
VALUES
  (
    'Pizza Palace', 
    '123 Main St, Anytown', 
    'Italian', 
    4, 
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
    5, 
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
    6, 
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
  (3, 'California Roll', 'Crab, avocado, and cucumber roll', 7.99, 'https://images.unsplash.com/photo-1553621042-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80', 'Rolls'),
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
    7, 
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
    8, 
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
    9, 
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
    10, 
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
    11, 
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
    12, 
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

-- Insert sample dishes for Taco Fiesta (ID 4)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (4, 'Chicken Tacos', 'Grilled chicken, onions, cilantro on corn tortillas', 9.99, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80', 'Tacos'),
  (4, 'Beef Burrito', 'Seasoned ground beef, rice, beans, cheese wrapped in a flour tortilla', 11.99, 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80', 'Burritos'),
  (4, 'Guacamole & Chips', 'Freshly made guacamole with crispy tortilla chips', 6.99, 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Appetizers');

-- Insert sample dishes for Curry House (ID 5)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (5, 'Chicken Tikka Masala', 'Grilled chicken in a creamy tomato sauce', 15.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1071&q=80', 'Curry'),
  (5, 'Vegetable Samosas', 'Crispy pastry filled with spiced potatoes and peas', 5.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Appetizers'),
  (5, 'Garlic Naan', 'Soft Indian flatbread with garlic', 3.99, 'https://images.unsplash.com/photo-1596797038530-2c107aa4f835?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'Breads');

-- Insert sample dishes for Vegan Vibes Cafe (ID 6)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (6, 'Quinoa Salad Bowl', 'Quinoa, mixed greens, avocado, chickpeas, lemon dressing', 12.99, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80', 'Salads'),
  (6, 'Lentil Soup', 'Hearty lentil soup with vegetables', 7.99, 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', 'Soups'),
  (6, 'Avocado Toast', 'Smashed avocado on whole grain toast with seeds', 9.99, 'https://images.unsplash.com/photo-1588137378633-56eb7d7a6d2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', 'Breakfast');

-- Insert sample dishes for Pasta Place (ID 7)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (7, 'Spaghetti Carbonara', 'Spaghetti with pancetta, egg, parmesan, and black pepper', 16.99, 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', 'Pasta'),
  (7, 'Lasagna Bolognese', 'Layered pasta with meat sauce, béchamel, and cheese', 18.99, 'https://images.unsplash.com/photo-1619894991209-9f9694be045a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', 'Pasta'),
  (7, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99, 'https://images.unsplash.com/photo-1571877236404-e801a08e8939?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', 'Desserts');

-- Insert sample dishes for Thai Terrace (ID 8)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (8, 'Pad Thai', 'Stir fried noodles with shrimp, tofu, peanuts, and lime', 14.99, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80', 'Noodles'),
  (8, 'Green Curry Chicken', 'Chicken in spicy green curry with coconut milk and vegetables', 15.99, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 'Curry'),
  (8, 'Mango Sticky Rice', 'Sweet sticky rice with fresh mango and coconut milk', 7.99, 'https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1978&q=80', 'Desserts');

-- Insert sample dishes for BBQ Central (ID 9)
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (9, 'Ribs Platter', 'Slow-smoked ribs with BBQ sauce, coleslaw, and cornbread', 22.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', 'Platters'),
  (9, 'Pulled Pork Sandwich', 'Slow-cooked pulled pork on a brioche bun with pickles', 13.99, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80', 'Sandwiches'),
  (9, 'Brisket', 'Smoked beef brisket with house sauce', 18.99, 'https://images.unsplash.com/photo-1623238913973-21c768c8dc4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', 'Meats');
