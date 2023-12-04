const mongoose = require('mongoose');

const astronautSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    skills: [String],
    missionTypes: [String],
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Astronaut', astronautSchema);