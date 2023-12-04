const Telemetry= require("./RocketTelemetrySchema");

class Rocket {
    telemetry;
    hasAnomaly;

    constructor() {
        this.hasAnomaly = false;
        this.telemetry = new Telemetry({
            altitude: 0, velocity: 0, fuel: 0, payload: "EMPTY", hasDetached: false
        });
    }

    init(id, altitude, velocity, fuel, payload, hasDetached) {
        this.telemetry.id = id
        this.telemetry.altitude = altitude
        this.telemetry.velocity = velocity
        this.telemetry.fuel = fuel
        this.telemetry.payload = (payload === "" || payload === undefined) ? "EMPTY" : payload
        this.telemetry.hasDetached = hasDetached
    }

    isGoForLaunch(rocket_payload, expected_data) {
        if (rocket_payload.expectedAltitude === null || rocket_payload.trajectory === "" || rocket_payload.payload === "") return false; else return (rocket_payload.expectedAltitude === expected_data.altitude && rocket_payload.trajectory === expected_data.trajectory && rocket_payload.payload === expected_data.payload)
    }
    getTelemetry() {
        return {
            altitude: this.telemetry.altitude,
            velocity: this.telemetry.velocity,
            fuel: this.telemetry.fuel,
            payload: this.telemetry.payload,
            hasDetached: this.telemetry.hasDetached
        }
    }

    saveTelemetry() {
        let telemetry = new Telemetry({
            id: this.telemetry.id,
            altitude: this.telemetry.altitude,
            velocity: this.telemetry.velocity,
            fuel: this.telemetry.fuel,
            payload: this.telemetry.payload,
            hasDetached: this.telemetry.hasDetached,
            timestamp: Date.now()
        })
        // console.log(JSON.stringify(telemetry));
        telemetry.save().then(() => {
            // console.log("Rocket Telemetry Saved")
        }).catch((e) => console.error("Cant save"));
    }
}

module.exports = new Rocket();

