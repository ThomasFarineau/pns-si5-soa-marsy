const express = require('express');
const fs = require("fs");
const path = require("path");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const {envController} = require("../controllers/env.controller");
const {dockerComposeController} = require("../controllers/dockercompose.controller");

const SERVICES_DIR = path.join(__dirname, "..", "..", "services");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get("/services", async (req, res) => {
    try {
        const services = await fs.promises.readdir(SERVICES_DIR);

        const serviceDetails = await Promise.all(services.map(async (service) => {
            try {
                const servicePath = path.join(SERVICES_DIR, service);
                const isDirectory = (await fs.promises.lstat(servicePath)).isDirectory();
                const hasPackageJson = await fs.promises.access(path.join(servicePath, "package.json")).then(() => true).catch(() => false);

                if (isDirectory && hasPackageJson) {
                    const envConfig = dotenv.config({path: path.join(servicePath, '.env')});
                    return {
                        name: service,
                        port: envConfig.error ? 0 : envConfig.parsed.PORT || 0
                    }
                }
            } catch (error) {
                console.error(`Error processing service ${service}:`, error.message);
            }
            return null;
        }));

        const validServices = serviceDetails.filter(Boolean);
        const sortedServices = validServices.sort((a, b) => {
            return a.port - b.port;
        });

        res.json(sortedServices);
    } catch (error) {
        console.error("Error fetching services:", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.post('/is-alive', (req, res) => {
    const {name, port} = req.body;
    const serviceUrl = `http://localhost:${port}`;

    axios.get(serviceUrl, {
        validateStatus: (status) => {
            return true;
        }
    }).then(response => {
        res.json({isAlive: true});
    }).catch(error => {
        console.error(`Error pinging service ${name} on port ${port}:`, error.message);
        res.json({isAlive: false});
    });
});

router.post('/update', async (req, res) => {
    envController.update(req.body.updatedServices)
    res.json({success: true})
});

module.exports = router;
