const axios = require("axios");

const LOGGER_API = process.env.LOGGER_API_URL;

const LOG = '/log';

function log(message) {
  console.log(message);
  axios.post(LOGGER_API + LOG, {
    service: 'template',
    message: message
  }).then(r => r)
    .catch(e => {
      if (e.statusCode !== 500) console.log(message)
    });
}

module.exports = log;