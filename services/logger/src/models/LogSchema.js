const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    service : { type: String, required: true },
    message : { type: Schema.Types.Mixed, required: true },
    timestamp : { type: Date, required: true }
});



// Export model
module.exports = mongoose.model('Logs', LogSchema);