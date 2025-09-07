const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configurer le client pour récupérer la clé publique Azure AD
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/keys`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware pour vérifier le token Azure AD
const verifyAzureToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token', error: err });

    req.user = {
      oid: decoded.oid,  // identifiant unique Azure AD
      email: decoded.upn
    };
    next();
  });
};

module.exports = verifyAzureToken;
