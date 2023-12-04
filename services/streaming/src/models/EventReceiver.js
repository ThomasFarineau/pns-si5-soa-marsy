const consumeMessages = require("../consumerService");

class EventReceiver {
    constructor() {
        this.events = {}
    }

    add(event) {
        this.events[event] = true
    }

    has = event => new Promise((resolve, reject) => {
        if (this.events[event]) {
            resolve(true)
        } else {
            reject(false)
        }
    });

    init() {
        const onMessage = (topic, message, key) => {
            this.add(key);
            console.log(`Received from ${topic}:`, key, message);
        };

        consumeMessages("rocket", onMessage).then(() => {
            console.log('Kafka message consumption initiated on rocket.');
        }).catch(error => {
            console.error(`Error consuming Kafka messages: ${error}`);
        });

        consumeMessages("booster", onMessage).then(() => {
            console.log('Kafka message consumption initiated on booster.');
        }).catch(error => {
            console.error(`Error consuming Kafka messages: ${error}`);
        });
    }

}

module.exports = new EventReceiver()