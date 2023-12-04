const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayloadTelemetrySchema = new Schema({
    id: { type: String, required: true},
    rocketId  : { type: String, required: true},
    altitude : { type: Number, required: true },
    temperature : { type: Number, required: true },
    speed : { type: Number, required: true },
    batteryLevel : { type: String, required: false },
    timestamp : { type: Date, required: true }
});

// Export model
module.exports = mongoose.model('PayloadTelemetry', PayloadTelemetrySchema);