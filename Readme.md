 ## 1. Initialisation du projet
```
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install --save-dev nodemon
```

## 2. Structure backend
```
safe-notes-backend/
│
├── controllers/         → Logique métier (ex: noteController.js)
├── routes/              → Routes API (ex: noteRoutes.js, authRoutes.js)
├── middlewares/         → Auth middlewares, error handlers, etc.
├── models/              → MongoDB Mongoose models (ex: User.js, Note.js)
├── services/            → Services Firebase, Mongo, etc.
├── config/              → Configuration Firebase, MongoDB URI
├── .env                 → Clés secrètes & URI
├── server.js            → Point d’entrée principal
└── package.json

```
## 3. 🪜 Étapes d’intégration Firebase Auth (Backend - Node.js avec Express)
3.1: Créer un projet Firebase sur console.firebase.google.com
3.2: Activer l’authentification (ex: email/password)
3.3: Installer le SDK côté backend :
```
npm install firebase-admin

```


