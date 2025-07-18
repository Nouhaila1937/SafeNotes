// config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../secrets/safenotesprivatekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
