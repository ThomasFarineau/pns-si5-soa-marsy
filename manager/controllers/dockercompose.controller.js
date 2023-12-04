const {readFileSync, writeFileSync} = require("fs");
const {join} = require("path");
const {load, dump} = require("js-yaml");

const DOCKER_COMPOSE_PATH = join(__dirname, "..", "..", "services", "docker-compose.yaml");
console.log("docker-compose.yaml path:", DOCKER_COMPOSE_PATH)
class DockerComposeController {

    get() {
        let dockerCompose
        try {
            dockerCompose = readFileSync(DOCKER_COMPOSE_PATH, 'utf8')
            dockerCompose = load(dockerCompose)
        } catch (error) {
            console.error("Error reading docker-compose.yml:", error.message)
        }
        return dockerCompose
    }

    update(newServices) {
        let dockerCompose = this.get()
        newServices.forEach(service => {
            let dockerService = dockerCompose.services[service.service]
            if(dockerService !== undefined) {
                dockerService.ports = [`${service.port}:${service.port}`]
                let portIndex = dockerService.environment.findIndex(env => env.includes("PORT"))
                if(portIndex !== -1) {
                    dockerService.environment[portIndex] = `PORT=${service.port}`
                } else {
                    dockerService.environment.push(`PORT=${service.port}`)
                }
                dockerService.container_name = "team-e-" + service.service
                dockerService.env_file = [".env"]
                dockerService.build = {
                    context: `./${service.service}`,
                    dockerfile: `Dockerfile`
                }
                dockerCompose.services[service.service] = dockerService
            }
        })
        const newDockerCompose = dump(dockerCompose, {lineWidth: -1});
        writeFileSync(DOCKER_COMPOSE_PATH, newDockerCompose, 'utf8');
    }
}

const dockerComposeController = new DockerComposeController()
module.exports = {dockerComposeController};