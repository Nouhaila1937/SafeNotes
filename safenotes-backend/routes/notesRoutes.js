const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
// const verifyToken = require('../middlewares/authMiddleware');

router.post('/notes', /* verifyToken, */ noteController.createNote);
router.get('/notes', /* verifyToken, */ noteController.getNotes);
router.delete('/notes/:id', /* verifyToken, */ noteController.deleteNote);
router.put('/notes/:id', /* verifyToken, */ noteController.updateNote);

module.exports = router;
