// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Skip connection during tests if no MongoDB available
    if (process.env.NODE_ENV === 'test' && !process.env.MONGODB_URI) {
      console.log('🧪 Skipping MongoDB connection in test environment');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Don't exit in test environment, just log the error
    if (process.env.NODE_ENV === 'test') {
      console.log('⚠️ Continuing tests without MongoDB connection');
      return;
    }
    
    process.exit(1); // Quitte le process en cas d'erreur (seulement en production)
  }
};

module.exports = connectDB;