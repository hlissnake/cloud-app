let MongoClient = require('mongodb').MongoClient;

const dbUrl = ''

MongoClient.connect(dbUrl, (err, db) => {

	db.close();
})