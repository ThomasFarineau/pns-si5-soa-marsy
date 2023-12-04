const axios = require("axios");

const ROCKET_STATUS_API = process.env.ROCKETSTATUS_API_URL;

const TELEMETRY_PAYLOAD = '/telemetry/payload';

const { v4 } = require('uuid');

class Payload {
    id
    rocketId
    defaultTemperature = -120;
    defaultSpeed = 7800;
    defaultBatteryLevel = 80;
    fluctuation = 0.05;

    altitude;
    temperature = this.defaultTemperature;
    speed = this.defaultSpeed;
    batteryLevel = this.defaultBatteryLevel;

    constructor(altitude) {
        this.id = v4();
        this.altitude = altitude;
    }

    setRocketID(rid) {
        this.rocketId = rid;
    }

    getTelemetry() {
        return {
            "id": this.id,
            "rocketId": this.rocketId,
            "altitude": this.altitude,
            "temperature": this.temperature,
            "speed": this.speed,
            "batteryLevel": this.batteryLevel.toFixed(2) + "%", // affiche la batterie avec deux décimales
        }
    }

    updateTelemetry() {
        this.temperature += (Math.random() - 0.5) * 2;
        this.speed += (Math.random() - 0.5) * 5;
        this.batteryLevel += (Math.random() - 0.5) * 2; // Fluctuation aléatoire de la batterie

        if (this.batteryLevel > this.defaultBatteryLevel * (1 + this.fluctuation)) {
            this.batteryLevel = this.defaultBatteryLevel * (1 + this.fluctuation);
        } else if (this.batteryLevel < this.defaultBatteryLevel * (1 - this.fluctuation)) {
            this.batteryLevel = this.defaultBatteryLevel * (1 - this.fluctuation);
        }

        if (this.speed > this.defaultSpeed * (1 + this.fluctuation)) {
            this.speed = this.defaultSpeed * (1 + this.fluctuation);
        } else if (this.speed < this.defaultSpeed * (1 - this.fluctuation)) {
            this.speed = this.defaultSpeed * (1 - this.fluctuation);
        }

        if (this.temperature > this.defaultTemperature * (1 + this.fluctuation)) {
            this.temperature = this.defaultTemperature * (1 + this.fluctuation);
        } else if (this.temperature < this.defaultTemperature * (1 - this.fluctuation)) {
            this.temperature = this.defaultTemperature * (1 - this.fluctuation);
        }

    }

    deploy() {
        console.log("Deploying the payload!");
        setInterval(() => {
            this.updateTelemetry();
            this.sendTelemetry();
        }, 5000, this);
    }

    sendTelemetry() {
        let telemetry_data = this.getTelemetry();
        
        console.log("====================== PAYLOAD TELEMETRY ======================");
        console.log(telemetry_data);
        axios.post(ROCKET_STATUS_API + TELEMETRY_PAYLOAD, telemetry_data).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(`Error sending telemetry: ${JSON.stringify(error)}`);
        });
    }
}

module.exports = Payload;