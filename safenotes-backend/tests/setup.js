// tests/setup.js - Configuration globale des tests
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
const mongoose = require('mongoose');
console.log('Connecting to MongoDB from setup test at:', process.env.MONGODB_URI);


// Configuration Jest globale
beforeAll(async () => {
  // Connexion à la base de test
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterAll(async () => {
  // Fermeture propre des connexions
  await mongoose.connection.close();
});
