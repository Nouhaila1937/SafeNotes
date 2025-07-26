require("dotenv").config(); // Charger les variables d'env
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const notesRouter = require('./routes/notesRoutes');


// Connexion à MongoDB
connectDB();
app.use(express.json()); // <-- AJOUT OBLIGATOIRE pour parser les requêtes JSON
// ... ici tu continues avec tes routes et middlewares

app.use('/api', notesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

app.listen(3000, () => {
  console.log("🚀 Serveur lancé sur le port 3000");
});
