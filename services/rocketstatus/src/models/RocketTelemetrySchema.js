const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RocketTelemetrySchema = new Schema({
    id: { type: String, required: true},
    altitude : { type: Number, required: true },
    velocity : { type: Number, required: true },
    fuel : { type: Number, required: true },
    payload : { type: String, required: false },
    hasDetached : { type: Boolean, required: true },
    timestamp : { type: Date, required: true }
});

// Export model
module.exports = mongoose.model('RocketTelemetry', RocketTelemetrySchema);