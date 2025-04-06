db = db.getSiblingDB('auth');

// Create users collection with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'password', 'role', 'email'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        role: {
          enum: ['client', 'restaurant', 'delivery'],
          description: 'must be a valid role and is required'
        },
        email: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Insert sample users (hashed passwords in real scenario)
// Note: In a real app, passwords would be hashed. These are sample plaintext passwords for development.
db.users.insertMany([
  {
    username: 'johndoe',
    password: '$2b$10$4Qn/Oo.gCikLdyLH3s1FEOFr3Zf2xMPLQbSYYomOpMM0jMwzHvNRa', // password1
    role: 'client',
    email: 'john@example.com',
    createdAt: new Date()
  },
  {
    username: 'janesmith',
    password: '$2b$10$e9VB0qVXoasAciUVbqYiG.Lv7Idr2y7LDQF9PB2kpL553qGE2KFuu', // password2
    role: 'client',
    email: 'jane@example.com',
    createdAt: new Date()
  },
  {
    username: 'bobjohnson',
    password: '$2b$10$kT8pwjIGjZNmzBZEwEZGfeFvG5jvnRh3frVA.LF0.Nz1tCzxWWn6q', // password3
    role: 'client',
    email: 'bob@example.com',
    createdAt: new Date()
  },
  {
    username: 'pizzapalace',
    password: '$2b$10$hRFz1lGiHLtXDjB.dD6ByeQuJ9q9d9s0HrQTmWfA0oME6Z1i3vklm', // restpass1
    role: 'restaurant',
    email: 'info@pizzapalace.com',
    createdAt: new Date()
  },
  {
    username: 'burgerbarn',
    password: '$2b$10$xdIwFWEY.gvpQj3cZlHweeF7ixZZgTe4SZO9BmmU6sTDL5KJ2pKZ.', // restpass2
    role: 'restaurant',
    email: 'hello@burgerbarn.com',
    createdAt: new Date()
  },
  {
    username: 'sushispot',
    password: '$2b$10$W5i8JKXXJtDcJfVNvfTareZ8mHyQNJ3SEjDZxiP/oF38fkpJPxM3G', // restpass3
    role: 'restaurant',
    email: 'contact@sushispot.com',
    createdAt: new Date()
  },
  {
    username: 'mikewilson',
    password: '$2b$10$q2nVFGD3mGg8QVLqvPcJR.0rxzX./2JBDg0hpvbLe6axodO5BSIge', // driverpass1
    role: 'delivery',
    email: 'mike@example.com',
    createdAt: new Date()
  },
  {
    username: 'sarahdavis',
    password: '$2b$10$6Cz15NunN1AfxI48e9SsQelR8cM1rRfL9jBn6TQyLB4lrSGKT9CCi', // driverpass2
    role: 'delivery',
    email: 'sarah@example.com',
    createdAt: new Date()
  },
  {
    username: 'tombrown',
    password: '$2b$10$9uABaFg2YrdfiaX1T6xYUu4JHoxbZZ8Z6QM13Bbu3TsOfUnuENC6a', // driverpass3
    role: 'delivery',
    email: 'tom@example.com',
    createdAt: new Date()
  }
]);

// Create logs collection
db = db.getSiblingDB('logs');
db.createCollection('system_logs');
db.createCollection('access_logs');

// Create indexes for logs
db.system_logs.createIndex({ timestamp: 1 });
db.system_logs.createIndex({ service: 1 });
db.system_logs.createIndex({ level: 1 });

db.access_logs.createIndex({ timestamp: 1 });
db.access_logs.createIndex({ userId: 1 });
db.access_logs.createIndex({ service: 1 });

print('Auth database initialization completed');