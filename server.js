const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/retours', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Mongoose Schema
const retourSchema = new mongoose.Schema({
    nom: String,
    message: String,
    categorie: String
});

const Retour = mongoose.model('Retour', retourSchema);

// Routes
app.post('/api/retours', async (req, res) => {
    const retour = new Retour(req.body);
    try {
        await retour.save();
        res.status(201).send(retour);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        res.status(400).send({ message: 'Erreur lors de la création du retour', error });
    }
});

app.get('/api/retours', async (_req, res) => {
    try {
        const retours = await Retour.find();
        res.status(200).send(retours);
    } catch (error) {
        console.error('Erreur lors de la récupération des retours:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération des retours', error });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});