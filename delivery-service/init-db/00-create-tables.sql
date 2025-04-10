-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create delivery_persons table
CREATE TABLE IF NOT EXISTS delivery_persons (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_available BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  current_location JSONB,
  current_order_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  delivery_person_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'assigned',
  pickup_location JSONB NOT NULL,
  delivery_location JSONB NOT NULL,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_delivery_persons_timestamp
BEFORE UPDATE ON delivery_persons
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_deliveries_timestamp
BEFORE UPDATE ON deliveries
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create indexes
CREATE INDEX idx_delivery_persons_user_id ON delivery_persons(user_id);
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_delivery_person_id ON deliveries(delivery_person_id); 