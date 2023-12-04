const express = require('express');
const axios = require("axios");
const Rocket = require("../models/Rocket");
const router = express.Router();
const apiTelemetryRouter = require("./telemetry");
const log = require("../utils/logger");


const ROCKET_DEPARTMENT_API = process.env.ROCKETDEPARTMENT_API_URL;
const ROCKET_API = process.env.ROCKET_API_URL;
const CUSTOMER_CARGO_API = process.env.CUSTOMERCARGO_API_URL;

const TELEMETRY_ROCKET = '/telemetry/rocket';
const LAUNCH_ROCKET = '/launch-rocket';
const FUEL_LEVEL = '/fuel-level';
const END_MISSION = '/end-mission';
const SPLIT_ROCKET = '/split-rocket';
const EXPECTED_DATA = '/expected-data';
const LAUNCH_READINESS = '/launch-readiness';
const PAYLOAD = '/payload';
const BOOSTER_FUEL_LEVEL = '/booster-fuel-level';
const DATA = '/data';
const SET_ANOMALY = '/set-anomaly';

router.get(LAUNCH_READINESS, (req, res) => {
    axios.get(ROCKET_API + PAYLOAD).then((rocket_payload) => {
        log({"Payload from rocket" : rocket_payload.data})
        axios.get(CUSTOMER_CARGO_API + EXPECTED_DATA).then((expected_data) => {
            log({"Expected data": expected_data.data});
            let finalStatus = Rocket.isGoForLaunch(rocket_payload.data, expected_data.data)
            log(`status : ${finalStatus}`);
            res.send({status: finalStatus ? "GO" : "NO GO"})
        }).catch(e => console.error(e))
    }).catch(e => console.error(e))
});

router.use('/telemetry', apiTelemetryRouter);

router.post(BOOSTER_FUEL_LEVEL, (req, res) => {
    log(`Rocket status received fuel level (${req.body.fuel})`);
    let data = {
        fuel: req.body.fuel
    }
    axios.post(ROCKET_DEPARTMENT_API + FUEL_LEVEL, data).then(r => {
        log(r.data);
        res.sendStatus(201);
    }).catch((e) => console.error(e))
})

router.get(DATA, (req, res) => {
    axios.get(ROCKET_API).then((r) => log(r)).catch(e => error(e))
})


router.post(SET_ANOMALY, (req, res) => {
    Rocket.hasAnomaly = true;
    res.send({
        "status": "Anomaly set",
    })
})

module.exports = router;
