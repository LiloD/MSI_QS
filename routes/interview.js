var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId
var Q = require('q');
var dbConf = require('../db');

router.get('/', function(req, res, next){
    // console.log('req', req.query);
    var filter = {};
    if(!!req.query.query) filter.Client = new RegExp(req.query.query, 'i');
    dbConf.con.then(function(db){
        return db.collection('interview').distinct('Client',filter);
    }).then(function(data){
        console.log(data);
        res.json(data);
        res.end();
    });
});



module.exports = router;