const express = require('express');
const router = express.Router();
const Rocket = require("../models/Rocket");

require('dotenv').config();

let rocket = new Rocket()

router.post("/launch-rocket", (req, res) => {
    rocket.handleMission();
    res.send({
        "status": req.body.status === "GO" ? "LAUNCHED" : "ABORTED",
    })
});

router.post("/set-data", (req, res) => {
    rocket.setPayload(req.body);
    res.send({
        "status": "Cargo received",
    })
});

router.post("/destroy", (req, res) => {
    rocket.destroy()
    res.send({
        "status": "Rocket Destroyed",
    })
})

router.post("/set-anomaly", (req, res) => {
    rocket.setcriticalAnomaly()
    res.send({
        "status": "Anomaly set",
    })
})

router.post("/split-rocket", (req, res) => {
    rocket.stageSeparation()
    res.send({
        "status": "Rocket splitted",
    })
});

router.get("/payload", function (req, res, next) {
    res.send(JSON.stringify(rocket));
});

router.post('/reset', (req, res) => {
    rocket.reset(res).then(() => {
        rocket = new Rocket();
        res.send(200);
    }).catch(() => {
        res.send(500);
    });
})

module.exports = router;
