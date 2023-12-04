const consumeMessages = require("../consumerService");
const {split, startMission, explode} = require("../routes/api");

class EventReceiver {
    constructor() {
    }

    handleEvent(key, message) {
        switch(key) {
            case "Stage separation":
                split(message);
                break;
            case "Liftoff/Launch (T+00:00:00)":
                startMission(message);
                break;
            case "Critical anomaly detected, destroying booster and rocket":
                explode(message);
                break;
        }
    }

    init() {
        const onMessage = (topic, message, key) => {
            console.log(`Received from ${topic}:`, key, message);
            switch (topic) {
                case "rocket":
                    this.handleEvent(key, message);
                    break;
                case "emergency":
                    this.handleEvent(key, message);
                    break;
            }
        };

        consumeMessages("rocket", onMessage).then(() => {
            console.log('Kafka message consumption initiated on rocket.');
        }).catch(error => {
            console.error(`Error consuming Kafka messages: ${error}`);
        });

        consumeMessages("emergency", onMessage).then(() => {
            console.log('Kafka message consumption initiated on rocket.');
        }).catch(error => {
            console.error(`Error consuming Kafka messages: ${error}`);
        });

    }

}

module.exports = new EventReceiver()