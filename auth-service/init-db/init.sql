-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('client', 'restaurant', 'delivery')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default users (Replace placeholders with actual bcrypt hashes)
-- IMPORTANT: Generate unique bcrypt hashes for each password. Do NOT use plain text.
-- Example password: 'password123'
-- Mot de passe client : client
-- Mot de passe restaurant : restaurant
-- Mot de passe livreur : delivery
INSERT INTO users (email, password, role)
SELECT 'client@example.com', '$2b$10$WP8eDUZWjmOb48LfVCM/zudg8tjeJ1WAou7WXmLfPtnztf7wPFtyC', 'client'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'client@example.com');

INSERT INTO users (email, password, role)
SELECT 'restaurant@example.com', '$2b$10$4Z/XrUGceeLbG4deQ3Farus0MOiXQ.EmsKq1MERZGaBdEeBLo9Bqy', 'restaurant'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'restaurant@example.com');

INSERT INTO users (email, password, role)
SELECT 'delivery@example.com', '$2b$10$1kyzn1Rg2yGCV8c2UzCpH.RVTJANtg4HHLdeLp.DS0QHmdMDouwqO', 'delivery'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'delivery@example.com'); 