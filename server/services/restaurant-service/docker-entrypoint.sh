#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for MySQL to be ready..."
node scripts/wait-for-db.js

# Initialize database (only if needed)
echo "Initializing database with sample data..."
node scripts/db-init.js

# Start the service
echo "Starting the service..."
exec "$@" 