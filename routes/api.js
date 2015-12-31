var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId
var Q = require('q');
var _ = require('lodash');
var dbConf = require('../db')

// interview, quest
router.get('/qs', function(req, res, next) {
    console.log(req.query);
    var page = req.query.page || 1;
    var pageSize = req.query.psize || 10;

    // default sort by date desc
    var sortBy = {};
    sortBy[req.query.psort || 'interview.Client'] = (req.query.psorta && parseInt(req.query.psorta)) || 1;

    var findOption = req.query.psize == -1 ? {} : {
        'skip': (page - 1) * pageSize,
        'limit': pageSize
    }
    var filter = {};
    if (!!req.query.qQuestion) filter.question = new RegExp(req.query.qQuestion, 'i');
    if (!!req.query.qCompany) filter['interview.Client'] = new RegExp(req.query.qCompany, 'i');
    if (!!req.query.qInterview) filter['interview._id'] = ObjectId(req.query.qInterview);
    dbConf.con.then(function(db) {
        return Q.all([
            db.collection('question').find(filter).count(),
            db.collection('question').find(filter, findOption).sort(sortBy).toArray()
        ]).spread(function(count, qs) {
            res.json({
                count: count,
                qs: qs
            })
        })
    }).catch(function(err) {
        next(err)
    })
});

// post questions with interview
router.post('/qs', function(req, res, next) {
    if (!req.body.questions || !req.body.questions.length || !req.body.interview) {
        res.json({
            msg: 'need questions and interview',
            body: req.body
        })
        return
    }
    var interview = req.body.interview
    var questions = req.body.questions
    console.log('insert many', interview, questions)
    dbConf.con.then(function(db) {
        return db.collection('interview1').insertOne(interview).then(function(iResult) {
            var qInfo = []
            questions.forEach(function(q) {
                qInfo.push({
                    question: q,
                    interview: interview
                })
            })
            console.log('after insert interview', interview)
            return db.collection('question1').insertMany(qInfo).then(function() {
                return qInfo
            })
        })
    }).then(function(qInfo) {
        res.json(qInfo)
    }).catch(console.error)
})

router.get('/cm', function(req, res, next){
    // console.log('in get cm');
    var qid = req.query.qid;
    console.log('qid', qid);
    // console.log(req.query);
    dbConf.con.then(function(db){
        db.collection('comment').find({qid: qid}).toArray()
            .then(function(data){
                console.log(data);
                res.json(data);
                res.end();
            });
    });
});


router.post('/cm',function(req, res, next){
    console.log('in insert cm');
    var co = {
        comment: req.body.comment,
        qid:req.body._id,
        username: req.body.username
    }
    console.log('insert comments', co);

    dbConf.con.then(function(db) {
        db.collection('comment').insertOne(co).then(function(insertCoRes) {
            console.log('insertCoRes', insertCoRes);
            if(insertCoRes.result.ok){
                res.json({ok: 1})
            }else{
                res.json({ok: 0})
            }
            res.end();
        })
    }).catch(function(err){
        res.json({ok:0});
        console.log('insert comment fail, reason', err);
        res.end();
    })
})

router.get('/it', function(req, res, next) {

    var page = req.query.page || 1;
    var pageSize = req.query.psize || 10;

    // default sort by date desc
    var sortBy ={};
    sortBy[req.query.psort || 'Client'] = req.query.psorta && parseInt(req.query.psorta) || -1;
    var findOption = {
        'skip': (page - 1) * pageSize,
        'limit': pageSize
    }
    var filter = {};
    if (!!req.query.iClient) filter['Client'] = new RegExp(req.query.iClient, 'i');
    if (!!req.query.iCandidate) filter['Candidate'] = new RegExp(req.query.iCandidate, 'i');
    if (!!req.query.iType) filter['Type'] = new RegExp(req.query.iType, 'i');

    dbConf.con.then(function(db) {
        return Q.all([
            db.collection('interview').find(filter).count(),
            db.collection('interview').find(filter, findOption).sort(sortBy).toArray()
        ]).spread(function(count, it) {
            res.json({
                count: count,
                it: it
            })
        })
    }).catch(function(err) {
        next(err)
    })
});

router.get('/it/:id', function(req, res, next) {
    dbConf.con.then(function(db) {
        return db.collection('interview').find({
            _id: new ObjectId(req.params.id)
        }).toArray()
    }).then(function(its){
        console.log(its)
        res.json(its[0])
    }).catch(console.error)
})

router.get('/qt/:id', function(req, res, next) {
    console.log('qt in')
    dbConf.con.then(function(db) {
        console.log('db in')
        return db.collection('question').find({
            _id: new ObjectId(req.params.id)
        }).toArray()
    }).then(function(qs){
        res.json(qs[0])
    }).catch(console.err)
})

module.exports = router;
