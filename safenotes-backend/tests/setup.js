// tests/setup.js - Configuration globale des tests
require('dotenv').config();
const mongoose = require('mongoose');

// Mock Firebase Admin pour éviter les erreurs d'authentification
jest.mock('../config/firebase', () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: process.env.UIDtest,
      email: 'test@safenotes.com'
    })
  })
}));

// Configuration Jest globale
beforeAll(async () => {
  // Connexion à la base de test
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
});

afterAll(async () => {
  // Fermeture propre des connexions
  await mongoose.connection.close();
});
