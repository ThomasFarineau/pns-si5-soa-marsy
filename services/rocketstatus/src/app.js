const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express");
const swaggerAutogen = require("swagger-autogen");
const log = require("./utils/logger");

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const initDatabase = () => new Promise((resolve, reject) => {
    const mongoDBURL = "mongodb://" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DB
    console.log(`Rocket status ${mongoDBURL}`)
    mongoose.connect(mongoDBURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Connected to MongoDB")
        resolve()
    }).catch(err => reject('Failed to connect to MongoDB:', err));
});

initDatabase().then().catch((e) => console.error(e));

const outputFile = './src/swagger_output.json';
const endpointsFiles = ["./src/routes.js"];

const doc = {
    info: {
        version: "1.0.0",
        title: "Rocket Status API"
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
