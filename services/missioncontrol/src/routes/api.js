const express = require('express');
const {
  getWeatherLaunchReadiness,
  getRocketStatusLaunchReadiness,
  sendStatusToRocketDepartment
} = require('../utils/restCallsToServices');
const axios = require("axios");
const log = require('../utils/logger');

const router = express.Router();

const ROCKET_API = process.env.ROCKET_API_URL;

const LAUNCH_READINESS = '/launch-readiness';
const ANOMALY = '/anomaly';
const DESTROY = '/destroy';
const RESET = '/reset';

router.get(LAUNCH_READINESS, (req, res) => {
  getWeatherLaunchReadiness().then((weatherData) => {
    getRocketStatusLaunchReadiness().then((rocketStatusData) => {
      const { status: rocketStatus } = rocketStatusData.data;
      const { status: weatherStatus } = weatherData.data;
      const sendRocket = (rocketStatus === 'GO' && weatherStatus === 'GO') ? 'GO' : 'NO GO';
      log(`Weather: ${weatherStatus}, Rocket: ${rocketStatus}, Mission Control: ${sendRocket}`);
      sendStatusToRocketDepartment({ status: sendRocket });
      res.send({
        weather: weatherStatus,
        rocket: rocketStatus,
        missionControl: sendRocket,
      });
    }).catch((error) => {
      console.error(`Error: ${error.message}`);
      res.status(500).send('An error occurred for rocket status.');
    });
  }).catch((error) => {
    console.error(`Error: ${error.message}`);
    res.status(500).send('An error occurred for weather.');
  });
});

router.post(ANOMALY, (req, res) => {
    log('Anomaly Received');
})

router.post(DESTROY, (req, res) => {
    log('Destroy Received, destroying rocket');
    axios.post(ROCKET_API + DESTROY).catch((e) => error(e))
    res.send({
        status: 'DESTROY ORDER RECEIVED, SENT DESTROY ORDER TO ROCKET',
    });
})

router.post(RESET, (req, res) => {
  axios.post(ROCKET_API + RESET).then(() => {
    log("Resetted rocket");
    res.sendStatus(201);
  }).catch(() => {
    log("Error resetting rocket");
    res.sendStatus(400);
  })
})

module.exports = router;
