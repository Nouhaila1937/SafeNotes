const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
const verifyAzureToken = require('../middlewares/authMiddleware'); // nouveau middleware

// Toutes les routes sécurisées utilisent verifyAzureToken
router.post('/notes', verifyAzureToken, noteController.createNote);
router.get('/notes', verifyAzureToken, noteController.getNotes);
router.delete('/notes/:id', verifyAzureToken, noteController.deleteNote);
router.put('/notes/:id', verifyAzureToken, noteController.updateNote);

module.exports = router;
