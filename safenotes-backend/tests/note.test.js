// Charger dotenv en premier
require("dotenv").config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Note = require('../models/Note');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  await Note.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("📚 Notes API", () => {
  
  it("✅ Doit créer une nouvelle note", async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        title: "Ma première note",
        content: "Ceci est le contenu de la note"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Ma première note");
  });

  it("❌ Doit renvoyer une erreur si les champs sont manquants", async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        title: ""
      });

    expect(res.statusCode).toBe(400);
  });

  it("✅ Doit récupérer toutes les notes", async () => {
    await Note.create({ title: "Test", content: "Contenu test" });

    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("✅ Doit mettre à jour une note", async () => {
    const note = await Note.create({ title: "Ancien titre", content: "Ancien contenu" });

    const res = await request(app)
      .put(`/api/notes/${note._id}`)
      .send({ title: "Nouveau titre", content: "Nouveau contenu" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Nouveau titre");
  });

  it("✅ Doit supprimer une note", async () => {
    const note = await Note.create({ title: "À supprimer", content: "Contenu" });

    const res = await request(app).delete(`/api/notes/${note._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimée/i);
  });

  it("❌ Doit renvoyer 404 si la note n'existe pas", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/notes/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });
});