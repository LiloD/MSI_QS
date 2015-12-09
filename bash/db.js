var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Q = require('q');

var saveDB = function(iInfos) {
    return mongoClient.connect('mongodb://localhost/qs').then(function(db) {
        return Q.all(iInfos.map(function(iInfo) {
            var qs = iInfo.qs;
            iInfo.Date = new Date(iInfo.Date)
            console.log('insert interview', iInfo)
            delete iInfo.qs;
            return db.collection('interview').insertOne(iInfo).then(function(iResult) {
                return Q.all(qs.map(function(question) {
                    return db.collection('question').insertOne({
                        interview: iInfo,
                        question: question
                    })
                }))
            })
        })).then(db.close.bind(db))
    })
}

module.exports = {
    save: saveDB
};
