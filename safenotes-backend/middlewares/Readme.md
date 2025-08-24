# C’est quoi un middleware ?
### Dans une application Node.js avec Express, un middleware est une fonction qui s’exécute entre la réception de la requête (request) par le serveur et la réponse (response) envoyée au client.
* Il peut lire/modifier la requête ou la réponse.
* Il peut décider si la requête doit continuer ou être arrêtée.
* On peut enchaîner plusieurs middlewares, chacun faisant un travail précis.

## Le middleware est un outil général pour intercepter, traiter, modifier ou contrôler les requêtes/réponses.

Pour sécuriser mon API SafeNotes, j’ai utilisé Azure AD pour l’authentification et l’autorisation. Chaque utilisateur reçoit un token JWT émis par Azure AD lorsqu’il se connecte.

Sur le backend, j’ai créé un middleware qui :

1.Vérifie que le token est présent dans l’en-tête Authorization.

2.Décode et valide le token avec les clés publiques d’Azure AD (RS256).

3.Récupère l’OID de l’utilisateur depuis le token et le met dans req.user.

Ensuite, chaque endpoint (création, lecture, modification, suppression des notes) utilise req.user.oid pour lier et sécuriser les données de l’utilisateur, afin qu’un utilisateur ne puisse accéder qu’à ses propres notes.