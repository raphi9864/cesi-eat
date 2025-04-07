const bcrypt = require('bcrypt');

const plainPassword = process.argv[2]; // Get password from command line argument
const saltRounds = 10; // Or 12 for higher security

if (!plainPassword) {
  console.error('Usage: node generate-hash.js <password_to_hash>');
  process.exit(1);
}

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  } else {
    console.log('Plain Password:', plainPassword);
    console.log('Bcrypt Hash:', hash);
    // Example: Use this hash in your init.sql or for testing
  }
}); 