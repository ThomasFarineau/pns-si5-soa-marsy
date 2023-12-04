const axios = require("axios");
const produceMessage = require('../producerService');
const KAFKA_TOPIC = "booster";
const { v4 } = require('uuid');

class Booster {
    rocketId;
    id;
    initialAltitude;
    altitude
    velocity
    trajectory
    angle
    landingFuel
    fuel

    constructor(altitude, velocity, trajectory, fuel, angle) {
        this.rocketId = null;
        this.id = v4();
        this.initialAltitude = altitude;
        this.altitude = altitude
        this.velocity = 0;
        this.trajectory = trajectory;
        this.angle = angle;
        this.landingFuel = 100;
        this.fuel = fuel;
    }

    setRocketId(rId) {
        this.rocketId = rId;
    }

    getTelemetry() {
        return {
            "id": this.id,
            "rocketId": this.rocketId,
            "altitude": this.altitude,
            "velocity": this.velocity,
            "trajectory": this.trajectory,
            "angle": this.angle,
            "landingFuel": this.landingFuel,
            "fuel": this.fuel
        }
    }


    split() {
        console.log("Start returning to earth")
        this.trajectory = "RETURNING";

        let gravityAcceleration = 9.8;
        let timeInterval = 0.5;
        let engineActivationAltitude = 1000;
        let angleCorrectionPerInterval = 5;

        let hasSentFlipManeuver = false;
        let hasSentEntryBurn = false;
        let hasSentGuidance = false;
        let hasSentLandingBurn = false;
        let hasSentLandingLegsDeployed = false;
        let hasLanding = false;

        let interval = setInterval(async () => {
            if (this.altitude <= 0) {
                clearInterval(interval);
                return;
            }

            if (!hasSentFlipManeuver) {
                await produceMessage(KAFKA_TOPIC, "Flip maneuver");
                hasSentFlipManeuver = true;
            }

            if (this.altitude <= (engineActivationAltitude + this.initialAltitude) / 2) {
                if (!hasSentEntryBurn) {
                    await produceMessage(KAFKA_TOPIC, "Entry burn");
                    hasSentEntryBurn = true;
                }
            }

            if (this.altitude <= (engineActivationAltitude + this.initialAltitude) / 4) {
                if (!hasSentGuidance) {
                    await produceMessage(KAFKA_TOPIC, "Guidance");
                    hasSentGuidance = true;
                }
                this.angle -= angleCorrectionPerInterval;
                this.angle = Math.max(this.angle, 90);
            }

            let effectiveAcceleration = gravityAcceleration; // Par défaut, en chute libre.

            if (this.altitude <= engineActivationAltitude) {
                if (!hasSentLandingBurn) {
                    await produceMessage(KAFKA_TOPIC, "Landing burn");
                    hasSentLandingBurn = true;
                }
                let requiredDeceleration = 0.5 * this.velocity * this.velocity / this.altitude;
                effectiveAcceleration = gravityAcceleration - requiredDeceleration;

                let estimatedTimeToLand = this.velocity / requiredDeceleration;

                let fuelConsumptionPerInterval = this.landingFuel / (estimatedTimeToLand / timeInterval);
                this.landingFuel -= fuelConsumptionPerInterval;
                this.landingFuel = Math.max(this.landingFuel, 0);
            }

            this.velocity += effectiveAcceleration * timeInterval;

            let displacement = this.velocity * timeInterval + 0.5 * effectiveAcceleration * timeInterval * timeInterval;
            this.altitude -= displacement;

            this.altitude = Math.max(this.altitude, 0);
            if (this.altitude <= 0.1 * engineActivationAltitude) {
                if (!hasSentLandingLegsDeployed) {
                    await produceMessage(KAFKA_TOPIC, "Landing legs deployed");
                    hasSentLandingLegsDeployed = true;
                }
            }
            if (this.altitude === 0) {
                if (!hasLanding) {
                    await produceMessage(KAFKA_TOPIC, "Landing");
                    hasLanding = true;
                }
            }
            this.sendTelemetry();
        }, 500, this);

    }

    sendTelemetry() {
        console.log("====================== BOOSTER TELEMETRY ======================")
        console.log(this.getTelemetry())
        axios.post(process.env.ROCKETSTATUS_API_URL + "/telemetry/booster", this.getTelemetry()).then(r => {
            console.log(r.data);
        });
    }

    updateFuel() {
        this.fuel = Math.max(this.fuel - 1, 0);
    }
}

module.exports = Booster;