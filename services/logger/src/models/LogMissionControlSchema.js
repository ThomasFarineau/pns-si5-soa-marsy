const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogMissionControlSchema = new Schema({
  service : { type: String, required: true },
  message : { type: Schema.Types.Mixed, required: true },
  timestamp : { type: Date, required: true }
});

module.exports = mongoose.model('MissionControl', LogMissionControlSchema);