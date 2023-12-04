const {writeFile} = require("fs");
const {join} = require("path");
const {dockerComposeController} = require("./dockercompose.controller");

const WEB_PREFIX = "http://"
const SERVICES_PATH = join(__dirname, "..", "..", "services");
const ENV_PATH = join(SERVICES_PATH, ".env");

require('dotenv').config();
const PORT = process.env.PORT || 3000;
console.log(".env path:", ENV_PATH)

class EnvController {
    update(services) {
        let newServices = services.sort((a, b) => a.port - b.port);
        newServices.forEach(service => {
            let path = join(SERVICES_PATH, service.service, ".env")
            this.write(path, this.file(newServices, true, service.port))
        })
        this.write(ENV_PATH, this.file(newServices, false))

        dockerComposeController.update(newServices)
    }

    write(destination, envFile) {
        writeFile(destination, envFile, (err) => {
            if (err) console.error(err)
        })
    }

    file(newServices, isLocalhost = true, port = null) {
        let env = port !== null ? `PORT=${port}\n\n` : ``
        Object.values(newServices).forEach(service => {
            let envName = service.service.replace(/-/g, '_')
            env += `${envName.toUpperCase()}_API_URL=${WEB_PREFIX}${isLocalhost ? "localhost" : service.service}:${service.port}/api\n`
        })
        // add the api url for the manager
        env += `\nMANAGER_API_URL=${WEB_PREFIX}${isLocalhost ? "localhost" : "manager"}:${PORT}\n`
        return env;
    }
}

const envController = new EnvController()
module.exports = {envController};