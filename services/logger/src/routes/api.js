const express = require('express');
const router = express.Router();
const Log = require("../models/LogSchema");
const LogRocket = require("../models/LogRocketSchema");
const LogBoosterTelemetry = require("../models/LogBoosterTelemetrySchema");
const LogMissionControl = require("../models/LogMissionControlSchema");
const LogRocketDepartment = require("../models/LogRocketDepartmentSchema");
const LogCustomerCargo = require("../models/LogCustomerCargoSchema");
const LogWeather = require("../models/LogWeatherSchema");
const LogBooster = require("../models/LogBoosterSchema");


router.get('/', (req, res) => {
    res.json({"status": "OK"});
});

router.post('/log', (req, res) => {
    console.log(`${req.body.service} : ${req.body.message}`);
    let log;

    switch (req.body.service) {
        case "rocket":
            log = new LogRocket({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        case "booster-telemetry":
            log = new LogBoosterTelemetry({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        case "mission-control":
            log = new LogMissionControl({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        case "rocket-department":
            log = new LogRocketDepartment({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        case "customer-cargo":
            log = new LogCustomerCargo({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        case "weather":
            log = new LogWeather({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        case "booster":
            log = new LogBooster({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
        default:
            log = new Log({
                service: req.body.service,
                message: req.body.message,
                timestamp: Date.now()
            });
            break;
    }

    log.save().then(() => {
        // res.send("Log Saved") // Comment this line, so it doesn't pollute the logs
    }).catch((err) => {
        console.error("Error saving log", err)
        res.status(500).send("Error saving log")
    })
});

module.exports = router;
