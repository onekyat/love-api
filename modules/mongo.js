const MongoClient = require('mongodb').MongoClient;

const MONGO_COLLECTION_LOVE = 'love';

let db;

module.exports.connect = () => {
  return MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then((client) => {
    db = client.db(process.env.MONGO_DB_NAME);
  });
};

module.exports.getDB = () => {
  return db;
};
