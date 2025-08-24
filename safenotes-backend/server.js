require("dotenv").config(); // Charger les variables d'env 
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const notesRouter = require('./routes/notesRoutes');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json"); // Fichier généré par swagger-autogen
const verifyAzureToken = require('./middlewares/authMiddleware'); // <-- Middleware Azure AD

// Connexion à MongoDB
connectDB();

app.use(express.json()); // <-- Parse les requêtes JSON

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes sécurisées
app.use('/api', verifyAzureToken, notesRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// Démarrage serveur
app.listen(3000, () => {
  console.log("🚀 Serveur lancé sur le port 3000");
});

module.exports = app;
