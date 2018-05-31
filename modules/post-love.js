const mongo = require('./mongo');
const kafka = require('./kafka');

const MONGO_COLLECTION_LOVE = 'love';
const KAFKA_TOPIC_ACTIVITY = 'activity';

const sendKafkaMessage = ({ userId, adId }) => {
  return new Promise((resolve, reject) => {
    kafka.client.refreshMetadata([KAFKA_TOPIC_ACTIVITY], (err, data) => {
      kafka.producer.send([{
        topic: KAFKA_TOPIC_ACTIVITY,
        messages: JSON.stringify({
          type: 'love',
          userId,
          adId
        })
      }], (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  });
};

const toggleLove = (params) => {
  const { userId, adId } = params;
  const collection = db.collection(MONGO_COLLECTION_LOVE);
  return collection.findOneAndDelete({ userId, adId }).then(({ value }) => {
    if (!value) {
      return collection.insertOne({
        userId,
        adId
      }).then(() => {
        // TODO: Produce the message after the activity is ready.
        // return sendKafkaMessage(params);
      }).then(() => ({ action: 'INSERT' }));
    } else {
      return { action: 'DELETE' };
    }
  });
};

let db;
module.exports = ({ params }, res) => {
  db = mongo.getDB();
  toggleLove(params).then((result) => {
    res.send(result);
  }).catch((err) => {
    res.send(500, err);
  });
};
