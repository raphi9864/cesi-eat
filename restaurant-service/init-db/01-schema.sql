-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  cuisine VARCHAR(100) NOT NULL,
  user_id VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  images TEXT[],
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  opening_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
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
CREATE TRIGGER update_restaurants_timestamp
BEFORE UPDATE ON restaurants
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_dishes_timestamp
BEFORE UPDATE ON dishes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create indexes
CREATE INDEX idx_restaurant_user_id ON restaurants(user_id);
CREATE INDEX idx_dish_restaurant ON dishes(restaurant_id);
CREATE INDEX idx_dish_category ON dishes(category);