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

router.post('/', function(req, res, next){
    dbConf.con.then(function(db){
        console.log(1);
        return dbConf.saveToInterview(db, req.body.it).then(function(insertItRes){
            console.log(2);
            if(!insertItRes.result.ok) throw err;
            return Q.all(req.body.qs.map(function(question){
                console.log(3);
                return dbConf.saveToQuestion(db, question).then(function(insertQsRes){
                    console.log(4);
                    if(!insertQsRes.result.ok) throw err;
                    return Q.all(question.tags.map(function(tag){
                        console.log(5, tag);
                        return dbConf.saveToTag(db, {'tag': tag});
                    }));
                });
            }));
        }).then(function(status){
            console.log('status', status);
            res.json('insert success');
            res.end();
        });
    }).catch(function(err){
        console.log('err', err);
        res.json("err");
        res.end();
    });
})


module.exports = router;