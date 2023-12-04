const express = require('express');
const axios = require("axios");
const MissionData = require("../MissionData");
const router = express.Router();
const log = require("../utils/logger");

let mission_data = new MissionData();

const ROCKET_API = process.env.ROCKET_API_URL;

const EXPECTED_DATA = '/expected-data';
const SET_DATA = '/set-data';

router.get(EXPECTED_DATA, (req, res) => {
    log("Sending expected data.");
    res.json(mission_data);
});

router.post(SET_DATA, (req, res) => {
    log("Setting data locally.");
    mission_data.payload = req.body.payload;
    mission_data.trajectory = req.body.trajectory;
    mission_data.altitude = req.body.altitude;
    axios.post(ROCKET_API + SET_DATA, mission_data).then(r => {
        if (r.status.toString().startsWith("2")) {
            log("Data set in rocket.");
            res.sendStatus(201);
        } else {
            log(`Error setting data : ${r.statusText}`);
            res.sendStatus(400);
        }
    }).catch(() => {
        log("Error sending set-data request.");
        res.sendStatus(400);
    });
});

module.exports = router;
