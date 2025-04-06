-- Insert sample restaurant data
INSERT INTO restaurants (name, address, cuisine, user_id, phone, email, opening_hours, images)
VALUES
  (
    'Pizza Palace', 
    '123 Main St, Anytown', 
    'Italian', 
    'rest1', 
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
    ARRAY['pizza1.jpg', 'pizza2.jpg']
  ),
  (
    'Burger Barn', 
    '456 Oak St, Someville', 
    'American', 
    'rest2', 
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
    ARRAY['burger1.jpg']
  ),
  (
    'Sushi Spot', 
    '789 Pine St, Othertown', 
    'Japanese', 
    'rest3', 
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
    ARRAY['sushi1.jpg', 'sushi2.jpg', 'sushi3.jpg']
  );

-- Insert sample dishes for Pizza Palace
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (1, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'margherita.jpg', 'Pizza'),
  (1, 'Pepperoni Pizza', 'Pizza with tomato sauce, mozzarella, and pepperoni', 14.99, 'pepperoni.jpg', 'Pizza'),
  (1, 'Garden Salad', 'Fresh mixed greens with tomatoes, cucumbers, and house dressing', 7.99, 'garden_salad.jpg', 'Salad'),
  (1, 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 4.99, 'garlic_bread.jpg', 'Sides');

-- Insert sample dishes for Burger Barn
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (2, 'Classic Burger', 'Beef patty with lettuce, tomato, onion, and special sauce', 10.99, 'classic_burger.jpg', 'Burgers'),
  (2, 'Cheeseburger', 'Beef patty with American cheese, lettuce, tomato, and onion', 11.99, 'cheeseburger.jpg', 'Burgers'),
  (2, 'Veggie Burger', 'Plant-based patty with lettuce, tomato, and avocado', 12.99, 'veggie_burger.jpg', 'Burgers'),
  (2, 'French Fries', 'Crispy golden fries with sea salt', 3.99, 'fries.jpg', 'Sides'),
  (2, 'Onion Rings', 'Battered and fried onion rings', 4.99, 'onion_rings.jpg', 'Sides');

-- Insert sample dishes for Sushi Spot
INSERT INTO dishes (restaurant_id, name, description, price, image, category)
VALUES
  (3, 'California Roll', 'Crab, avocado, and cucumber roll', 7.99, 'california_roll.jpg', 'Rolls'),
  (3, 'Spicy Tuna Roll', 'Spicy tuna and cucumber roll', 8.99, 'spicy_tuna.jpg', 'Rolls'),
  (3, 'Salmon Nigiri', 'Fresh salmon over pressed rice', 5.99, 'salmon_nigiri.jpg', 'Nigiri'),
  (3, 'Miso Soup', 'Traditional Japanese soybean soup with tofu and seaweed', 3.99, 'miso_soup.jpg', 'Soups'),
  (3, 'Edamame', 'Steamed soybean pods with sea salt', 4.99, 'edamame.jpg', 'Appetizers');