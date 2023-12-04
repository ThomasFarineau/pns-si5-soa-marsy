const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoosterTelemetrySchema = new Schema({
    id: { type: String, required: true},
    rocketId  : { type: String, required: true},
    altitude : { type: Number, required: true },
    velocity : { type: Number, required: true },
    trajectory : { type: String, required: true },
    fuel : { type: Number, required: true },
    landingFuel : { type: Number, required: true },
    angle : { type: Number, required: true },
    timestamp : { type: Date, required: true }
});

// Export model
module.exports = mongoose.model('BoosterTelemetry', BoosterTelemetrySchema);