const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://Edikan:pvsantakid@cluster0.sb2ik.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected to DB!');
      _db = client.db()
      callback();
    })
    .catch(err => {
      console.log(err, 'catch');
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
}

// module.exports = mongoConnect;
// module.exports = getDb;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
