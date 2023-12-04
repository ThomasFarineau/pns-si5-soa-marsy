const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const eventReceiver = require("./models/EventReceiver");
const swaggerUi = require("swagger-ui-express");
const swaggerAutogen = require("swagger-autogen");
require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

eventReceiver.init();

const outputFile = './src/swagger_output.json';
const endpointsFiles = ["./src/routes.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "Rocket Department API"
  },
  host: "localhost:" + (process.env.PORT ?? "3000"),
  basePath: "/",
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  const swaggerFile = require('./swagger_output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
  require('./routes.js')(app);
})

module.exports = app;
