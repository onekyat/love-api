const mongo = require('./mongo');

const MONGO_COLLECTION_LOVE = 'love';

const getLovesByUserId = (userId) => {
  const collection = db.collection(MONGO_COLLECTION_LOVE);
  const cursor = collection.find({ userId });
  return cursor.toArray().then(loves => loves.map(love => love.adId));
};

let db;
module.exports = ({ params }, res) => {
  db = mongo.getDB();
  getLovesByUserId(params.userId).then((adIds) => {
    res.send({ adIds });
  }).catch((err) => {
    res.send(500, err);
  });
};
