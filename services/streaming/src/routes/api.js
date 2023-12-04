const express = require('express');
const router = express.Router();
const log = require("../utils/logger");
const eventReceiver = require("../models/EventReceiver");

router.get("/:event", function (req, res, next) {
    let eventName = req.params.event
    console.log(`Checking event: ${eventName}`)
    eventReceiver.has(eventName).then(() => res.send("OK")).catch(() => res.send("NOK"))
});

module.exports = router;
