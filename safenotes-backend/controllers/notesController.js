// controllers/noteController.js

const Note = require('../models/Note');
const { encrypt, decrypt } = require('../controllers/notesController');

// Ajouter une note
exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      title: encrypt(req.body.title),
      content: encrypt(req.body.content),
      firebaseUid: process.env.UIDtest,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error("Erreur lors de la création de la note :", error);
    res.status(500).send("Internal server error");
  }
};

// Obtenir toutes les notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ firebaseUid: process.env.UIDtest });

    if (!notes || notes.length === 0) {
      return res.status(404).send("Notes not found");
    }

    const decryptedNotes = notes.map(note => ({
      _id: note._id,
      title: decrypt(note.title),
      content: decrypt(note.content),
      firebaseUid: note.firebaseUid,
      createdAt: note.createdAt,
    }));

    res.json(decryptedNotes);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    res.status(500).send("Internal server error");
  }
};

// Supprimer une note
exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully", note: deletedNote });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};

// Mettre à jour une note
exports.updateNote = async (req, res) => {
  try {
    const encryptedData = {
      title: encrypt(req.body.title),
      content: encrypt(req.body.content),
    };

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      encryptedData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    const decryptedNote = {
      _id: updatedNote._id,
      title: decrypt(updatedNote.title),
      content: decrypt(updatedNote.content),
      firebaseUid: updatedNote.firebaseUid,
      createdAt: updatedNote.createdAt,
    };

    res.json({ message: "Note updated successfully", note: decryptedNote });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Error updating note", error });
  }
};
