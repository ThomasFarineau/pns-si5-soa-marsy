const {v4} = require('uuid');
const axios = require("axios");
const log = require("../utils/logger");
const produceMessage = require("../producerService");
const KAFKA_TOPIC = "rocket"
const KAFKA_TOPIC_EMERGENCY = "emergency"

let CRITICAL_ANOMALY = false

class Rocket {
    id
    altitude
    expectedAltitude
    velocity
    trajectory
    payload
    hasDetached
    fuel
    tmpMaxQ
    maxQReached

    constructor() {
        this.id = v4();
        this.altitude = 0;
        this.expectedAltitude = null;
        this.velocity = 1;
        this.fuel = 100;
        this.payload = "";
        this.trajectory = "";
        this.hasDetached = false;
        this.isDestroyed = false;
        this.angle = 180
        this.tmpMaxQ = 0
        this.maxQReached = 0;
    }

    getTelemetry() {
        return {
            "id": this.id,
            "altitude": this.altitude,
            "velocity": this.velocity,
            "trajectory": this.trajectory,
            "fuel": this.fuel,
            "angle": this.angle,
            "payload": this.payload,
            "hasDetached": this.hasDetached
        }
    }

    setcriticalAnomaly() {
        CRITICAL_ANOMALY = true
    }

    stageSeparation() {
        if (!this.hasDetached) {
            this.hasDetached = true

            log("Sending split request to booster")
            log(`${process.env.BOOSTER_API_URL}/split`)
            produceMessage(KAFKA_TOPIC, "Main engine cut-off").then(() => {
                log("Sent main engine cut-off")
                return new Promise(resolve => setTimeout(resolve, 1000));
            }).then(() => produceMessage(KAFKA_TOPIC, "Stage separation", this.getTelemetry())).then(() => {
                log("Sent stage separation");
                return new Promise(resolve => setTimeout(resolve, 1000));
            }).then(() => {
                return produceMessage(KAFKA_TOPIC, "Second engine start");
            }).then(() => {
                log("Sent second engine start")
            }).catch(e => console.error(e))
        }
    }

    pression = () => (1.225 * Math.exp(-this.altitude / 7400)) //pression en fonction de l'altitude (en mètres)

    maxQ = () => (0.5 * this.pression() * this.velocity * this.velocity) //pression dynamique

    coefficientMultiplicatif() {
        if (this.altitude < 100) {
            return 1.2;
        } else if (this.altitude < 1000) {
            return 1.1;
        } else if (this.altitude < 2000) {
            return 1.05;
        } else if (this.altitude < 10000) {
            return 1.02;
        } else if (this.altitude < 100000) {
            return 1.015;
        } else {
            return 1.01;
        }
    }

    update() {
        if (this.hasDetached && this.fuel !== 0) this.fuel = Math.max(this.fuel - 1, 0);

        this.altitude = this.altitude + this.velocity

        if (this.maxQ() > 16000) {
            this.maxQReached += 5
        }

        if (this.maxQReached > 0) {
            this.maxQReached -= 1
            if (!this.hasReachedMaxQ) {
                produceMessage(KAFKA_TOPIC, "MaxQ").then(() => log("Sent maxQ"))
                this.hasReachedMaxQ = true;
            }
            //Do nothing for 5 ticks of fuel then start to increase velocity again
        } else {
            this.velocity = (this.velocity + 2) * this.coefficientMultiplicatif()
        }

        if (this.altitude>75000 & CRITICAL_ANOMALY & !this.isDestroyed) {
            if (!this.hasDetached){
                produceMessage(KAFKA_TOPIC_EMERGENCY, "Critical anomaly detected, destroying booster and rocket").then(() => log("Sent critical anomaly detected"))
                log("Critical anomaly detected")
            }
            else {
                produceMessage(KAFKA_TOPIC_EMERGENCY, "Critical anomaly detected")
                log("Sent critical anomaly detected")
            }
            this.destroy()
        }

    }

    setPayload(receivedData) {
        log({"Setting payload": {receivedData}})
        produceMessage(KAFKA_TOPIC, "Rocket preparation").then(() => {
            log("Sent rocket preparation")
            return new Promise(resolve => setTimeout(resolve, 1000));
        }).then(() => produceMessage(KAFKA_TOPIC, "Rocket on internal power")).then(() => {
            log("Sent rocket on internal power")
        })
        this.expectedAltitude = receivedData.altitude;
        this.trajectory = receivedData.trajectory;
        this.payload = receivedData.payload;
    }

    destroy() {
        this.isDestroyed = true;
        produceMessage(KAFKA_TOPIC_EMERGENCY, "Rocket destroyed", this.getTelemetry())
        log("Destroying rocket")
    }

    handleMission() {
        produceMessage(KAFKA_TOPIC, "Startup (T-00:01:00)").then(() => {
            log("Sent startup (waiting 5 seconds for real)")
            return new Promise(resolve => setTimeout(resolve, 5000));
        }).then(() => produceMessage(KAFKA_TOPIC, "Main engine start (T-00:00:03)")).then(() => {
            log("Sent main engine start")
            return new Promise(resolve => setTimeout(resolve, 3000));
        }).then(() => produceMessage(KAFKA_TOPIC, "Liftoff/Launch (T+00:00:00)", {"rocketId": this.id})).then(() => {
            log("Sent liftoff")
            const interval = setInterval(() => {
                if (this.isDestroyed) {
                    clearInterval(interval);
                    return;
                }

                if (this.altitude >= this.expectedAltitude) {
                    produceMessage(KAFKA_TOPIC, "Fairing separation").then(() => {
                        return new Promise(resolve => setTimeout(resolve, 1000));
                    }).then(() => {
                        produceMessage(KAFKA_TOPIC, "Second engine cut-off").then(() => log("Sent second engine cut-off"))
                        return new Promise(resolve => setTimeout(resolve, 1000));
                    }).then(() => this.deployPayload())
                    clearInterval(interval);
                }

                this.update();
                console.log("====================== ROCKET TELEMETRY ======================")
                console.log(this.getTelemetry())
                axios.post(process.env.ROCKETSTATUS_API_URL + "/telemetry/rocket", this.getTelemetry()).then(r => {
                    log(r.data);
                });
            }, 500, this);
        })
    }

    deployPayload() {
        produceMessage(KAFKA_TOPIC, "Payload separation/deploy", this.getTelemetry()).then(() => log("Sent payload deployed"))
    }

    reset() {
        return new Promise(function(resolve) {
            axios.post(process.env.BOOSTER_API_URL + "/reset").then(() => {
                log("Reset booster")
                resolve();
            }).catch(e => console.error(e))
        })
    }
}

module.exports = Rocket;