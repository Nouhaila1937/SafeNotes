// config/firebase.js ce fichier, qui initialise Firebase Admin SDK avec ta clé privée.
const admin = require("firebase-admin");
const serviceAccount = require("../secrets/safenotesprivatekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
