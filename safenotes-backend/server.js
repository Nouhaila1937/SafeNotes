require("dotenv").config(); // Charger les variables d'env 
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const notesRouter = require('./routes/notesRoutes');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json"); // Fichier généré par swagger-autogen


// Connexion à MongoDB
connectDB();
app.use(express.json()); // <-- AJOUT OBLIGATOIRE pour parser les requêtes JSON
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api', notesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

app.listen(3000, () => {
  console.log("🚀 Serveur lancé sur le port 3000");
});

module.exports = app;