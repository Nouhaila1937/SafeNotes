const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Algo symétrique
const key = crypto.scryptSync(process.env.CRYPTO_SECRET, 'salt', 32); // 32 bytes key
const iv = Buffer.alloc(16, 0); // IV de 16 bytes rempli de 0 (pour simplifier)

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
