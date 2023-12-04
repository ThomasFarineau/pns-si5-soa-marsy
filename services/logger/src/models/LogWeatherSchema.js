const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogWeatherSchema = new Schema({
  service : { type: String, required: true },
  message : { type: Schema.Types.Mixed || {}, required: true },
  timestamp : { type: Date, required: true }
});

module.exports = mongoose.model('Weather', LogWeatherSchema);