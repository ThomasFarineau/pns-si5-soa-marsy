const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'team-e-booster-consumer',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'booster' });

const consumeMessages = async (topic, onMessage) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const key = message.key.toString();
            const value = JSON.parse(message.value.toString());
            onMessage(topic, value, key);
        },
    });
};

module.exports = consumeMessages;
