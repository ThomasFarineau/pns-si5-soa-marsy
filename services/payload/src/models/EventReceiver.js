const consumeMessages = require("../consumerService");
const { deploy } = require("../routes/api");

class EventReceiver {
    constructor() {
    }

    handleEvent(key, message) {
        switch(key) {
            case "Payload separation/deploy":
                deploy(message);
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
            }
        };

        consumeMessages("rocket", onMessage).then(() => {
            console.log('Kafka message consumption initiated on rocket.');
        }).catch(error => {
            console.error(`Error consuming Kafka messages: ${error}`);
        });
    }

}

module.exports = new EventReceiver()