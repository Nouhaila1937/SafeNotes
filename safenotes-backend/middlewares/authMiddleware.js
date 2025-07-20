const admin = require('../config/firebase'); // vers le fichier firebase.js

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = "LAwRz3PB2keexjHh9oZHSXlbQWS2"; // contient uid, email, etc.
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error });
  }
};

module.exports = verifyToken;
