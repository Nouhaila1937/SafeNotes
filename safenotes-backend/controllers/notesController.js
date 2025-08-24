// controllers/noteController.js

const Note = require('../models/Note');
const { encrypt, decrypt } = require('./cryptoHelper');

// Ajouter une note
exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      title: encrypt(req.body.title),
      content: encrypt(req.body.content),
      azureAdId: req.user.oid, // Lier la note à l'utilisateur Azure AD
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error("Erreur lors de la création de la note :", error);
    res.status(500).send("Internal server error");
  }
};

// Obtenir toutes les notes de l'utilisateur connecté
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ azureAdId: req.user.oid });

    if (!notes || notes.length === 0) {
      return res.status(404).send("Notes not found");
    }

    const decryptedNotes = notes.map(note => ({
      _id: note._id,
      title: decrypt(note.title),
      content: decrypt(note.content),
      azureAdId: note.azureAdId, // remplacé firebaseUid
      createdAt: note.createdAt,
    }));

    res.json(decryptedNotes);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
    res.status(500).send("Internal server error");
  }
};

// Supprimer une note (vérifier que l'utilisateur est propriétaire)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.azureAdId !== req.user.oid) {
      return res.status(403).json({ message: "Forbidden: Not your note" });
    }

    await note.remove();
    res.json({ message: "Note deleted successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};

// Mettre à jour une note (vérifier que l'utilisateur est propriétaire)
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.azureAdId !== req.user.oid) {
      return res.status(403).json({ message: "Forbidden: Not your note" });
    }

    note.title = encrypt(req.body.title);
    note.content = encrypt(req.body.content);

    const updatedNote = await note.save();

    const decryptedNote = {
      _id: updatedNote._id,
      title: decrypt(updatedNote.title),
      content: decrypt(updatedNote.content),
      azureAdId: updatedNote.azureAdId,
      createdAt: updatedNote.createdAt,
    };

    res.json({ message: "Note updated successfully", note: decryptedNote });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Error updating note", error });
  }
};
