const consumeMessages = require("../consumerService");

class EventReceiver {
    constructor() {
    }

    endOfMission(message) {

    }

    handleEvent(key, message) {
        switch(key) {
            case "Payload separation/deploy":
                this.endOfMission(message);
                break;
            case "Rocket destroyed":
                this.endOfMission(message);
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
            console.log('Kafka message consumption initiated on emergency.');
        }).catch(error => {
            console.error(`Error consuming Kafka messages: ${error}`);
        });

    }

}

module.exports = new EventReceiver()