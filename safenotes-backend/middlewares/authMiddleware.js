const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configurer le client pour récupérer la clé publique Azure AD
const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/keys`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      console.error('❌ Erreur lors de la récupération de la clé:', err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware pour vérifier le token Azure AD
const verifyAzureToken = (req, res, next) => {
  console.log('🔍 Middleware d\'authentification appelé');
  console.log('📋 Headers Authorization:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Pas de token fourni');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🎫 Token reçu (longueur):', token.length);

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('❌ Erreur de validation du token:', err.message);
      return res.status(401).json({ 
        message: 'Invalid token', 
        error: err.message,
        details: 'Vérifiez que le token est valide et non expiré'
      });
    }

    console.log('✅ Token valide. Payload complet:', JSON.stringify(decoded, null, 2));
    
    // CORRECTION: Gérer les tokens d'application (client_credentials)
    if (decoded.oid) {
      // Token utilisateur - contient un oid
      req.user = {
        oid: decoded.oid,
        email: decoded.upn || decoded.email || decoded.preferred_username,
        type: 'user'
      };
    } else if (decoded.sub || decoded.appid) {
      // Token d'application - utiliser l'ID de l'application comme identifiant
      req.user = {
        oid: decoded.sub || decoded.appid || 'app_' + decoded.aud,
        email: 'app@' + (decoded.appid || 'application'),
        type: 'application',
        appId: decoded.appid
      };
    } else {
      console.error('❌ Ni oid ni appid trouvé dans le token');
      return res.status(401).json({ 
        message: 'Invalid token structure',
        hint: 'Le token ne contient pas d\'identifiant utilisateur ou application valide'
      });
    }
    
    console.log('👤 Utilisateur/App identifié:', req.user);
    next();
  });
};

module.exports = verifyAzureToken;