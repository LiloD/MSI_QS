var mc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var dbLink = "mongodb://localhost/qs";
var dbCon = mc.connect(dbLink);

module.exports = {
	link: dbLink,
	con: dbCon
}