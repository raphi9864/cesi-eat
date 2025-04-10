-- Insert sample client profiles
INSERT INTO client_profiles (id, name, address, phone, saved_addresses)
VALUES
  (1, 
    'John Doe', 
    '123 Maple Dr, Anytown', 
    '555-111-2222',
    '[
      {
        "name": "Home", 
        "address": "123 Maple Dr, Anytown", 
        "isDefault": true
      },
      {
        "name": "Work", 
        "address": "456 Corporate Blvd, Anytown", 
        "isDefault": false
      }
    ]'
  ),
  (2,
    'Jane Smith', 
    '789 Oak Ln, Someville', 
    '555-333-4444',
    '[
      {
        "name": "Home", 
        "address": "789 Oak Ln, Someville", 
        "isDefault": true
      }
    ]'
  ),
  (3, 
    'Bob Johnson', 
    '101 Pine St, Othertown', 
    '555-555-6666',
    '[
      {
        "name": "Home", 
        "address": "101 Pine St, Othertown", 
        "isDefault": true
      },
      {
        "name": "Gym", 
        "address": "202 Fitness Ave, Othertown", 
        "isDefault": false
      }
    ]'
  );

-- Reset the sequence for client_profiles
SELECT setval('client_profiles_id_seq', 3);

-- Insert sample orders
INSERT INTO orders (
  client_id, restaurant_id, restaurant_name, 
  total_price, status, delivery_address, 
  delivery_notes, payment_method, payment_status,
  delivery_id
)
VALUES
  (
    1, 1, 'Pizza Palace',
    32.97, 'delivered', '123 Maple Dr, Anytown',
    'Please leave at the door', 'credit_card', 'completed',
    1  -- Livreur #1
  ),
  (
    1, 3, 'Sushi Spot',
    22.97, 'delivered', '456 Corporate Blvd, Anytown',
    NULL, 'credit_card', 'completed',
    2  -- Livreur #2
  ),
  (
    2, 2, 'Burger Barn',
    26.97, 'delivered', '789 Oak Ln, Someville',
    'Ring doorbell', 'paypal', 'completed',
    1  -- Livreur #1
  ),
  (
    3, 1, 'Pizza Palace',
    27.98, 'delivered', '101 Pine St, Othertown',
    NULL, 'credit_card', 'completed',
    3  -- Livreur #2
  ),
  (
    2, 3, 'Sushi Spot',
    17.97, 'pending', '789 Oak Ln, Someville',
    NULL, 'credit_card', 'pending',
    3
  );

-- Insert sample order items
INSERT INTO order_items (order_id, dish_id, name, price, quantity)
VALUES
  -- Order 1: Pizza Palace - John Doe
  (1, 1, 'Margherita Pizza', 12.99, 1),
  (1, 2, 'Pepperoni Pizza', 14.99, 1),
  (1, 3, 'Garden Salad', 7.99, 1),
  -- Order 2: Sushi Spot - John Doe
  (2, 10, 'California Roll', 7.99, 1),
  (2, 11, 'Spicy Tuna Roll', 8.99, 1),
  (2, 13, 'Miso Soup', 3.99, 1),
  (2, 14, 'Edamame', 4.99, 1),
  -- Order 3: Burger Barn - Jane Smith
  (3, 5, 'Classic Burger', 10.99, 1),
  (3, 6, 'Cheeseburger', 11.99, 1),
  (3, 8, 'French Fries', 3.99, 1),
  -- Order 4: Pizza Palace - Bob Johnson
  (4, 1, 'Margherita Pizza', 12.99, 1),
  (4, 2, 'Pepperoni Pizza', 14.99, 1),
  -- Order 5: Sushi Spot - Jane Smith
  (5, 10, 'California Roll', 7.99, 1),
  (5, 11, 'Spicy Tuna Roll', 8.99, 1);