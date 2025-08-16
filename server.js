const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/retours', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Mongoose Schema for Retour
const retourSchema = new mongoose.Schema({
    nom: String,
    message: String,
    categorie: String
});

const Retour = mongoose.model('Retour', retourSchema); // Create Retour model

// Route to create a new retour
app.post('/api/retours', async (req, res) => {
    const { nom, message, categorie } = req.body; // Destructuring request body
    if (!nom || !message || !categorie) { // Check for missing fields
        return res.status(400).send({ message: 'Tous les champs sont requis (nom, message, catégorie)' }); // Handle missing fields
    }
    const retour = new Retour(req.body); // Create a new retour from the request body
    try {
        await retour.save(); // Save the retour to the database
        res.status(201).send(retour); // Respond with the created retour
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        res.status(400).send({ message: 'Erreur lors de la création du retour', error }); // Handle error
    }
});

// Route to retrieve all retours
app.get('/api/retours', async (_req, res) => {
    try {
        const retours = await Retour.find(); // Retrieve all retours from the database
        res.status(200).send(retours); // Respond with the retours
    } catch (error) {
        console.error('Erreur lors de la récupération des retours:', error);
        res.status(500).send({ message: 'Erreur lors de la récupération des retours', error }); // Handle error
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`); // Start the server and log the message
});