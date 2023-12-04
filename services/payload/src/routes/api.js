const express = require('express');
const router = express.Router();
const Payload = require("../models/Payload");
const log = require("../utils/logger");

function deploy(message) {
    log("Setting Payload Data");
    log(message);
    let payload = new Payload(message.altitude, message.velocity, message.trajectory, message.fuel, message.angle);
    payload.setRocketID(message.id);
    payload.deploy()
}

module.exports = { router, deploy };
