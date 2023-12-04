const express = require('express');
const axios = require("axios");
const log = require("../utils/logger");

const router = express.Router();

const MINIMUM_FUEL_LEVEL = 5;

const ROCKET_API = process.env.ROCKET_API_URL;

const LAUNCH_ROCKET = '/launch-rocket';
const FUEL_LEVEL = '/fuel-level';
const SPLIT_ROCKET = '/split-rocket';


router.post(LAUNCH_ROCKET, (req, res) => {
    log(`Rocket launch status: ${req.body.status}`);
    if (req.body.status === 'GO') {
        axios.post(ROCKET_API + LAUNCH_ROCKET).then(() => {
            log("Launch rocket")
        }).catch(e => {
            console.error(e)
        })
    }
    res.send({
        status: req.body.status === 'GO' ? 'LAUNCHED' : 'ABORTED',
    });
});

router.post(FUEL_LEVEL, (req, res) => {
    log(`Fuel level received (${req.body.fuel})`);
    if (req.body.fuel <= MINIMUM_FUEL_LEVEL) {
        axios.post(ROCKET_API + SPLIT_ROCKET).then(() => {
            log("SENDING SPLIT TO ROCKET")
            res.send({
                status: 'SPLIT ORDER SENT',
            });
        }).catch((e) => {
            console.error(e)
        })
    } else {
        res.send({
            status: 'FUEL LEVEL OK',
        });
    }
});

module.exports = router;
