const axios = require('axios');
const log = require('./logger');

const WEATHER_URL = process.env.WEATHER_API_URL;
const ROCKET_STATUS_URL = process.env.ROCKETSTATUS_API_URL;
const ROCKET_DEPARTMENT_URL = process.env.ROCKETDEPARTMENT_API_URL;

const LAUNCH_READINESS = '/launch-readiness';
const LAUNCH_ROCKET = '/launch-rocket';
const END_MISSION = '/end-mission';


const getWeatherLaunchReadiness = () => {
  log(`Getting weather readiness from: ${WEATHER_URL}${LAUNCH_READINESS}`);
  return axios.get(WEATHER_URL + LAUNCH_READINESS);
};

const getRocketStatusLaunchReadiness = () => {
  log(`Getting rocket readiness from: ${ROCKET_STATUS_URL} ${LAUNCH_READINESS}`);
  return axios.get(ROCKET_STATUS_URL + LAUNCH_READINESS);
};

const sendStatusToRocketDepartment = (data) => {
  log(`Sending rocket launch status ${data.status} to: ${ROCKET_DEPARTMENT_URL}${LAUNCH_ROCKET}`);
    return axios.post(ROCKET_DEPARTMENT_URL + LAUNCH_ROCKET, data);
};

module.exports = {
  getWeatherLaunchReadiness,
  getRocketStatusLaunchReadiness,
  sendStatusToRocketDepartment
};
