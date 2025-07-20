require("dotenv").config(); // Charger les variables d'env
const express = require("express");
const connectDB = require("./config/db");
const notesRouter = require('./routes/notesRoutes');
const app = express();

// Connexion à MongoDB
connectDB();
app.use(express.json()); // <-- AJOUT OBLIGATOIRE pour parser les requêtes JSON
// ... ici tu continues avec tes routes et middlewares

app.use('/api', notesRouter);


app.listen(3000, () => {
  console.log("🚀 Serveur lancé sur le port 3000");
});
