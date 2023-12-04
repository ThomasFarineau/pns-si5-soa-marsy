const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerAutogen = require("swagger-autogen");
require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const outputFile = './src/swagger_output.json';
const endpointsFiles = ["./src/routes.js"];

const doc = {
    info: {
        version: "1.0.0", title: "Rocket API"
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

// launch app
app.listen(process.env.PORT || 3000, (h) => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    console.log(`Swagger doc is available on http://localhost:${(process.env.PORT ?? "3000")}/api-docs`);
});

module.exports = app;
