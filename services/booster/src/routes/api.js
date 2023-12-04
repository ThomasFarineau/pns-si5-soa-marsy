const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booster = require("../models/Booster");
const log = require("../utils/logger");

const ROCKET_STATUS_API = process.env.ROCKETSTATUS_API_URL;

const BOOSTER_FUEL_LEVEL = '/booster-fuel-level';
const RESET = '/reset';

let booster = new Booster(null, null, null, 100, null);
let interval = null;

function startMission(message) {
    log("Booster: starting mission");
    booster.setRocketId(message.rocketId);
    interval = setInterval(() => {
        if (booster.fuel >= 0) {
            let data = {
                fuel: booster.fuel
            }
            booster.updateFuel();
            axios.post(ROCKET_STATUS_API + BOOSTER_FUEL_LEVEL, data).then(() => {
                log(`Sent fuel level (${booster.fuel})`);
            })
        }
    }, 500);
}

function split(message) {
    clearInterval(interval);
    log("Setting booster data : ");
    log(message)
    booster = new Booster(message.altitude, message.velocity, message.trajectory, 0, message.angle);
    booster.setRocketId(message.id)
    booster.split()
}

function explode(message) {
    clearInterval(interval);
    log("Exploding booster :");
    log(message)
}

router.post(RESET, (req, res) => {
    booster = new Booster(null, null, null, 100, null);
    res.sendStatus(200);
})

module.exports = { router, split, startMission ,explode};
