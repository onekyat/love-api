const kafka = require('kafka-node'),
  Producer = kafka.Producer,
  client = new kafka.Client(),
  producer = new Producer(client, {
    partitionerType: 2
  });

producer.on('ready', () => {
  console.log('Connected to Kafka.');
});

producer.on('error', (err) => {
  console.error(err);
});

module.exports.producer = producer;
module.exports.client = client;
