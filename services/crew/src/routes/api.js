const express = require('express');
const router = express.Router();
const Astronaut = require('../models/AstronautSchema'); // Assurez-vous que le chemin est correct

require('dotenv').config();

router.post('/add', async (req, res) => {
    try {
        const newAstronaut = new Astronaut({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            skills: req.body.skills,
            missionTypes: req.body.missionTypes
        });

        const savedAstronaut = await newAstronaut.save();

        res.status(201).json(savedAstronaut);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/select/:limit', async (req, res) => {
    try {
        const { skills, missionTypes } = req.query;
        const limit = parseInt(req.params.limit);

        // Convertir les compétences et les types de mission en tableaux
        const skillsArray = skills.split(',');
        const missionTypesArray = missionTypes.split(',');

        // Trouver des astronautes correspondant aux critères
        const matchingAstronauts = await Astronaut.find({
            available: true,
            missionTypes: { $in: missionTypesArray }
        })
            .sort({ skills: -1 }) // Trier par le nombre de compétences correspondantes
            .limit(limit);

        res.status(200).json(matchingAstronauts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/lock/:id', async (req, res) => {
    try {
        const astronaut = await Astronaut.findByIdAndUpdate(
            req.params.id,
            { $set: { available: false } },
            { new: true }
        );

        if (!astronaut) {
            return res.status(404).json({ message: "Astronaute non trouvé" });
        }

        res.status(200).json(astronaut);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        // Récupérer tous les astronautes de la base de données
        const astronauts = await Astronaut.find({});

        // Envoyer les astronautes en réponse
        res.status(200).json(astronauts);
    } catch (error) {
        // En cas d'erreur, envoyer un message d'erreur
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;