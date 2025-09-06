// tests/setup.js - Configuration avec MongoDB Memory Server
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let mongod;

// Mock du middleware d'authentification pour tous les tests
jest.mock('../middlewares/authMiddleware', () => {
  return (req, res, next) => {
    req.user = {
      oid: process.env.UIDtest || 'test-user-12345',
      email: 'test@example.com'
    };
    next();
  };
});

// Configuration Jest globale
beforeAll(async () => {
  try {
    console.log('🧪 Démarrage MongoDB Memory Server pour les tests...');
    
    // Créer une instance MongoDB en mémoire
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('📦 MongoDB Memory Server démarré:', uri);
    
    // Se connecter à la base de test en mémoire
    await mongoose.connect(uri);
    console.log('✅ Base de données de test connectée');
    
  } catch (error) {
    console.error('❌ Erreur lors du setup des tests:', error);
    throw error;
  }
}, 60000); // Timeout de 60 secondes

// Nettoyage entre les tests
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  try {
    console.log('🧹 Nettoyage des tests...');
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    
    if (mongod) {
      await mongod.stop();
    }
    
    console.log('✅ Nettoyage terminé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}, 60000);