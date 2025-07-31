// ===============================================
// tests/integration/notes.test.js - Tests API PRIORITAIRES require("../setup");
// ===============================================

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Note = require('../models/Note');
const { encrypt, decrypt } = require('../controllers/cryptoHelper');

const TEST_UID = process.env.UIDtest ;

describe("🗒️ SafeNotes API - Tests d'Intégration", () => {

  beforeEach(async () => {
    // Nettoyer la base avant chaque test
    await Note.deleteMany({});
  });

  describe("POST /api/notes - Création de notes", () => {
    
    const validNoteData = {
      title: "Ma note de test",
      content: "Contenu secret à chiffrer"
    };

    it("✅ CRITIQUE: Doit créer une note et la chiffrer en base", async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .send(validNoteData)
        .expect(201);

      // Vérifications de la réponse
      expect(res.body._id).toBeDefined();
      expect(res.body.firebaseUid).toBe(TEST_UID);
      expect(res.body.title).toBe(validNoteData.title); // Déchiffré dans la réponse
      expect(res.body.content).toBe(validNoteData.content);
      
      // CRITIQUE: Vérifier que c'est chiffré en base
      const noteInDB = await Note.findById(res.body._id);
      expect(noteInDB.title).not.toBe(validNoteData.title);
      expect(noteInDB.content).not.toBe(validNoteData.content);
      
      // Vérifier qu'on peut déchiffrer
      expect(decrypt(noteInDB.title)).toBe(validNoteData.title);
      expect(decrypt(noteInDB.content)).toBe(validNoteData.content);
    });

    it("❌ CRITIQUE: Doit échouer sans authentification", async () => {
      const res = await request(app)
        .post('/api/notes')
        .send(validNoteData)
        .expect(401);
      
      expect(res.body.message).toBe('No token provided');
    });

    it("❌ Doit échouer avec titre manquant", async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .send({ content: "Contenu sans titre" })
        .expect(500);
    });

    it("❌ Doit échouer avec contenu manquant", async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .send({ title: "Titre sans contenu" })
        .expect(500);
    });

    it("❌ Doit échouer avec données vides", async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .send({ title: "", content: "" })
        .expect(500);
    });
  });

  describe("GET /api/notes - Récupération de notes", () => {
    
    beforeEach(async () => {
      // Créer des notes de test
      await Note.create([
        {
          title: encrypt("Note publique"),
          content: encrypt("Contenu public"),
          firebaseUid: TEST_UID
        },
        {
          title: encrypt("Note privée"),
          content: encrypt("Contenu privé"),
          firebaseUid: TEST_UID
        },
        {
          title: encrypt("Note autre utilisateur"),
          content: encrypt("Ne doit pas apparaître"),
          firebaseUid: TEST_UID
        }
      ]);
    });

    it("✅ CRITIQUE: Doit récupérer seulement les notes de l'utilisateur", async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2); // Seulement les notes du TEST_UID
      
      // Vérifier que les données sont déchiffrées
      expect(res.body[0].title).toBe("Note publique");
      expect(res.body[0].content).toBe("Contenu public");
      expect(res.body[1].title).toBe("Note privée");
      expect(res.body[1].content).toBe("Contenu privé");
      
      // SÉCURITÉ: Vérifier qu'aucune note d'autre utilisateur
      expect(res.body.every(note => note.firebaseUid === TEST_UID)).toBe(true);
    });

    it("✅ Doit retourner 404 si aucune note", async () => {
      await Note.deleteMany({}); // Supprimer toutes les notes
      
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .expect(404);
      
      expect(res.text).toBe("Notes not found");
    });

    it("❌ CRITIQUE: Doit échouer sans authentification", async () => {
      const res = await request(app)
        .get('/api/notes')
        .expect(401);
      
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe("PUT /api/notes/:id - Mise à jour de notes", () => {
    
    let testNote;
    
    beforeEach(async () => {
      testNote = await Note.create({
        title: encrypt("Titre original"),
        content: encrypt("Contenu original"),
        firebaseUid: TEST_UID
      });
    });

    it("✅ CRITIQUE: Doit mettre à jour et rechiffrer les données", async () => {
      const updateData = {
        title: "Titre modifié",
        content: "Contenu modifié"
      };

      const res = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .set('Authorization', 'Bearer mock-token')
        .send(updateData)
        .expect(200);

      expect(res.body.message).toBe("Note updated successfully");
      expect(res.body.note.title).toBe(updateData.title);
      expect(res.body.note.content).toBe(updateData.content);

      // CRITIQUE: Vérifier que c'est rechiffré en base
      const updatedNote = await Note.findById(testNote._id);
      expect(updatedNote.title).not.toBe(updateData.title);
      expect(decrypt(updatedNote.title)).toBe(updateData.title);
      expect(decrypt(updatedNote.content)).toBe(updateData.content);
    });

    it("❌ Doit retourner 404 pour note inexistante", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/notes/${fakeId}`)
        .set('Authorization', 'Bearer mock-token')
        .send({ title: "Test", content: "Test" })
        .expect(404);

      expect(res.body.message).toBe("Note not found");
    });

    it("❌ SÉCURITÉ: Doit échouer avec ID invalide", async () => {
      const res = await request(app)
        .put('/api/notes/invalid-id')
        .set('Authorization', 'Bearer mock-token')
        .send({ title: "Test", content: "Test" })
        .expect(500);
    });

    it("❌ CRITIQUE: Doit échouer sans authentification", async () => {
      const res = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .send({ title: "Test", content: "Test" })
        .expect(401);
    });
  });

  describe("DELETE /api/notes/:id - Suppression de notes", () => {
    
    let testNote;
    
    beforeEach(async () => {
      testNote = await Note.create({
        title: encrypt("Note à supprimer"),
        content: encrypt("Contenu à supprimer"),
        firebaseUid: TEST_UID
      });
    });

    it("✅ CRITIQUE: Doit supprimer définitivement la note", async () => {
      const res = await request(app)
        .delete(`/api/notes/${testNote._id}`)
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(res.body.message).toBe("Note deleted successfully");
      
      // CRITIQUE: Vérifier que la note n'existe plus
      const deletedNote = await Note.findById(testNote._id);
      expect(deletedNote).toBeNull();
    });

    it("❌ Doit retourner 404 pour note inexistante", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/notes/${fakeId}`)
        .set('Authorization', 'Bearer mock-token')
        .expect(404);

      expect(res.body.message).toBe("Note not found");
    });

    it("❌ CRITIQUE: Doit échouer sans authentification", async () => {
      const res = await request(app)
        .delete(`/api/notes/${testNote._id}`)
        .expect(401);
    });
  });

  describe("🔒 Tests de Sécurité", () => {
    
    it("❌ CRITIQUE: Ne doit pas permettre l'accès aux notes d'autres utilisateurs", async () => {
      // Créer une note pour un autre utilisateur
      const otherUserNote = await Note.create({
        title: encrypt("Note privée autre utilisateur"),
        content: encrypt("Contenu secret"),
        firebaseUid: TEST_UID
      });

      // Tenter de la récupérer avec notre token
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', 'Bearer mock-token')
        .expect(404); // Aucune note trouvée pour notre utilisateur

      // Tenter de la modifier
      await request(app)
        .put(`/api/notes/${otherUserNote._id}`)
        .set('Authorization', 'Bearer mock-token')
        .send({ title: "Hack", content: "Hack" })
        .expect(404); // Note non trouvée (filtrage par UID)

      // Tenter de la supprimer
      await request(app)
        .delete(`/api/notes/${otherUserNote._id}`)
        .set('Authorization', 'Bearer mock-token')
        .expect(404); // Note non trouvée
    });
  });
});