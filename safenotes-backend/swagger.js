// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API Notes",
    description: "Documentation automatique avec swagger-autogen",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json"; // Fichier généré
const endpointsFiles = ["./server.js", "./routes/notesRoutes.js"]; // fichiers où il y a les routes

swaggerAutogen(outputFile, endpointsFiles, doc);
