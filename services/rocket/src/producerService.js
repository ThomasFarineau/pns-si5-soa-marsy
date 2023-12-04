const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'team-e-rocket-producer',
    brokers: ['kafka:9092']
});

const producer = kafka.producer();

const produceMessage = async (topic, name, message = "") => {
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [{ key: name, value: JSON.stringify(message) }]
    });
    console.log("[KAFKA] Sent to " + topic + ": " + name + " " + JSON.stringify(message));
    await producer.disconnect();
};

module.exports = produceMessage;
