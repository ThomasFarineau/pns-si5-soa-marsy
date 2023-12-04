const express = require('express');
const axios = require("axios");
const Rocket = require("../models/Rocket");
const router = express.Router();
const PayloadTelemetry = require("../models/PayloadTelemetrySchema");
const BoosterTelemetry = require("../models/BoosterTelemetrySchema");
const RocketTelemetry = require("../models/RocketTelemetrySchema");

const ROCKET = '/rocket';
const BOOSTER = '/booster';
const PAYLOAD = '/payload';

let SMALL_ANOMALY = false;
let SMALL_ANOMALY2 = false;
let hasTriggeredAnomaly = false;
let hasTriggeredAnomaly2 = false;

router.post(ROCKET, (req, res) => {
    Rocket.init(req.body.id, req.body.altitude, req.body.velocity, req.body.fuel, req.body.payload, req.body.hasDetached)
    Rocket.saveTelemetry();
    res.send(Rocket.getTelemetry());
    if (SMALL_ANOMALY && Rocket.telemetry.altitude > 25000 && !hasTriggeredAnomaly) {
        hasTriggeredAnomaly = true;
        axios.post(process.env.MISSIONCONTROL_API_URL + "/anomaly", Rocket.getTelemetry()).then(r => console.log(r)).catch(e => console.error(e))
    }
    if (SMALL_ANOMALY2 && Rocket.telemetry.altitude > 40000 && !hasTriggeredAnomaly2) {
        hasTriggeredAnomaly2 = true;
        axios.post(process.env.MISSIONCONTROL_API_URL + "/anomaly", Rocket.getTelemetry()).then(r => console.log(r)).catch(e => console.error(e))
    }
    if (Rocket.hasAnomaly) {
        axios.post(process.env.MISSIONCONTROL_API_URL + "/anomaly", Rocket.getTelemetry()).then(r => console.log(r)).catch(e => console.error(e))
    }
})

router.post(ROCKET + "/set-anomaly", (req, res) => {
    SMALL_ANOMALY = true;
    SMALL_ANOMALY2 = true;
    res.send("Anomaly set")
})

router.get(ROCKET, (req, res) => {
    RocketTelemetry.find({}).sort({timestamp: 'asc'}).then((result) => {
        res.send(result);
    }).catch((error) => {
        console.log(error)
        res.sendStatus(400);
    })
})

router.post(BOOSTER, (req, res) => {
    let boosterTelemetry = new BoosterTelemetry({
        id: req.body.id,
        rocketId: req.body.rocketId,
        altitude: req.body.altitude,
        velocity: req.body.velocity,
        trajectory: req.body.trajectory,
        fuel: req.body.fuel,
        landingFuel: req.body.landingFuel,
        angle: req.body.angle,
        timestamp: Date.now()
    })
    boosterTelemetry.save().then(() => {
        res.send("Booster Telemetry Saved")
    }).catch(() => {
        res.status(500).send("Booster saving payload telemetry")
    })
})

router.get(BOOSTER, (req, res) => {
    BoosterTelemetry.find({}).sort({timestamp: 'asc'}).then((result) => {
        res.send(result);
    }).catch((error) => {
        console.log(error)
        res.sendStatus(400);
    })
})

router.post(PAYLOAD, (req, res) => {
    let payloadTelemetry = new PayloadTelemetry({
        id: req.body.id,
        rocketId: req.body.rocketId,
        altitude: req.body.altitude,
        temperature: req.body.temperature,
        speed: req.body.speed,
        batteryLevel: req.body.batteryLevel,
        timestamp: Date.now()
    })
    payloadTelemetry.save().then(() => {
        res.send("Payload Telemetry Saved")
    }).catch(() => {
        res.status(500).send("Error saving payload telemetry")
    })
})

router.get(PAYLOAD, (req, res) => {
    PayloadTelemetry.find({}).sort({timestamp: 'asc'}).then((result) => {
        res.send(result);
    }).catch((error) => {
        console.log(error)
        res.sendStatus(400);
    })
})

module.exports = router;
