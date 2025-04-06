-- Insert sample delivery persons
INSERT INTO delivery_persons (
  user_id, name, phone, email, 
  is_available, is_active, current_location
)
VALUES
  (
    'driver1', 
    'Mike Wilson', 
    '555-777-8888', 
    'mike@example.com',
    true, 
    true,
    '{
      "latitude": 40.7128,
      "longitude": -74.0060,
      "lastUpdated": "2023-01-01T12:00:00Z"
    }'
  ),
  (
    'driver2', 
    'Sarah Davis', 
    '555-999-0000', 
    'sarah@example.com',
    true, 
    true,
    '{
      "latitude": 40.7150,
      "longitude": -74.0080,
      "lastUpdated": "2023-01-01T12:05:00Z"
    }'
  ),
  (
    'driver3', 
    'Tom Brown', 
    '555-111-3333', 
    'tom@example.com',
    false, 
    true,
    '{
      "latitude": 40.7200,
      "longitude": -74.0100,
      "lastUpdated": "2023-01-01T12:10:00Z"
    }'
  );

-- Insert sample completed deliveries for past orders
INSERT INTO deliveries (
  order_id, delivery_person_id, status,
  pickup_location, delivery_location,
  assigned_at, picked_up_at, delivered_at,
  estimated_delivery_time
)
VALUES
  (
    '1', 'driver1', 'delivered',
    '{
      "address": "123 Main St, Anytown",
      "latitude": 40.7130,
      "longitude": -74.0065
    }',
    '{
      "address": "123 Maple Dr, Anytown",
      "latitude": 40.7140,
      "longitude": -74.0070
    }',
    '2023-01-01T12:15:00Z',
    '2023-01-01T12:25:00Z',
    '2023-01-01T12:45:00Z',
    30
  ),
  (
    '2', 'driver2', 'delivered',
    '{
      "address": "789 Pine St, Othertown",
      "latitude": 40.7210,
      "longitude": -74.0110
    }',
    '{
      "address": "456 Corporate Blvd, Anytown",
      "latitude": 40.7160,
      "longitude": -74.0090
    }',
    '2023-01-01T12:30:00Z',
    '2023-01-01T12:40:00Z',
    '2023-01-01T13:00:00Z',
    35
  ),
  (
    '3', 'driver3', 'delivered',
    '{
      "address": "456 Oak St, Someville",
      "latitude": 40.7170,
      "longitude": -74.0095
    }',
    '{
      "address": "789 Oak Ln, Someville",
      "latitude": 40.7180,
      "longitude": -74.0100
    }',
    '2023-01-01T13:00:00Z',
    '2023-01-01T13:10:00Z',
    '2023-01-01T13:30:00Z',
    25
  ),
  (
    '4', 'driver1', 'delivered',
    '{
      "address": "123 Main St, Anytown",
      "latitude": 40.7130,
      "longitude": -74.0065
    }',
    '{
      "address": "101 Pine St, Othertown",
      "latitude": 40.7220,
      "longitude": -74.0120
    }',
    '2023-01-01T14:00:00Z',
    '2023-01-01T14:10:00Z',
    '2023-01-01T14:40:00Z',
    40
  );

-- Insert a sample in-progress delivery
INSERT INTO deliveries (
  order_id, delivery_person_id, status,
  pickup_location, delivery_location,
  assigned_at, picked_up_at,
  estimated_delivery_time
)
VALUES
  (
    '5', 'driver3', 'assigned',
    '{
      "address": "789 Pine St, Othertown",
      "latitude": 40.7210,
      "longitude": -74.0110
    }',
    '{
      "address": "789 Oak Ln, Someville",
      "latitude": 40.7180,
      "longitude": -74.0100
    }',
    NOW(),
    NULL,
    30
  );

-- Update driver status for in-progress delivery
UPDATE delivery_persons 
SET is_available = false, current_order_id = '5'
WHERE user_id = 'driver3';