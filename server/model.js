'use strict';
// let MongoClient = require('mongodb').MongoClient;
// const dbUrl = 'mongodb://localhost:27017/snake'
// const connect = (operation) => {
// 	MongoClient.connect(dbUrl, (err, db) => {
// 		if(err) {
// 			console.log(err)	
// 		} else {
// 			console.log('db connection success')
// 		}
// 		operation(db);
// 	})
// }
// const createNewModel = (collectionName, schema) => {
// 	return class Model 
// 		contructor(documentData) {
// 		}
// 		save() {
// 		}
// 		static find() {
// 		}
// 	}
// }
// module.exports = {
// 	collection(collectionName, schema) {
// 		return createNewModel(collectionName, schema)
// 	}
// };

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/snake');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected')
});

let TreeSchema = new mongoose.Schema({
	parent : String,
	content : String,
	checkable : Boolean,
	children : Array
})

let TreeModel = mongoose.model('Tree', TreeSchema);

module.exports = TreeModel
