const express = require('express');
const router = express.Router();
const log = require("../utils/logger");

const LAUNCH_READINESS = '/launch-readiness';
const CURRENT_WEATHER = '/current-weather';


const generateGo = () => ({
    status: "GO", details: {
        temperature: true, wind: true, precipitation: true, humidity: true, pressure: true, visibility: true
    }
});

const generateNoGo = () => ({
    status: "NO GO", details: {
        temperature: Math.random() < 0.5,
        wind: Math.random() < 0.5,
        precipitation: Math.random() < 0.5,
        humidity: Math.random() < 0.5,
        pressure: Math.random() < 0.5,
        visibility: false
    }
});

router.get(LAUNCH_READINESS, (req, res, next) => {
    if (process.env.LAUNCH_READINESS === undefined) {
        res.send(Math.random() < 0.5 ? generateGo() : generateNoGo());
    } else {
        let launchReadiness = process.env.LAUNCH_READINESS.search(/true/i) !== -1;
        res.send(launchReadiness ? generateGo() : generateNoGo());
    }
});

function generateDouble(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function generateTypeOfPrecipitation() {
    const types = ['rain', 'snow', 'sleet', 'hail', 'thunderstorm'];
    return types[Math.floor(Math.random() * types.length)];
}

router.get(CURRENT_WEATHER, (req, res, next) => {
    res.send({
        temperature: generateDouble(5, 30) + '°C',
        wind: {
            speed: generateDouble(5, 80) + 'km/h', direction: generateDouble(0, 360) + '°'
        },
        precipitation: {
            type: generateTypeOfPrecipitation(), probability: generateDouble(0, 1), intensity: generateDouble(0, 1)
        },
        humidity: generateDouble(0.3, 0.8),
        pressure: generateDouble(0.98, 1.02) + "bar",
        visibility: generateDouble(1, 10) + 'km',
        sunrise: '06:00',
        sunset: '18:00'
    })
});

module.exports = router;
