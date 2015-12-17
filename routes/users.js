var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var Q = require('q');
var dbConf = require('../db');
var passport = require('passport');



router.get('/check', function(req, res, next) {
    console.log('cookies', req.cookies);
    console.log('users', req.user);
    res.end();
});

/*
 * 
 */
router.post('/new', function(req, res, next) {
    //check username/password field here

    //get and construct user 
    console.log(req.body);
    var user = req.body;
    console.log('user', user);
    user.active = 1; //change later
    user.level = 1; //change lager
    user.ctime = Date.now() //in ms
    user.mtime = user.ctime;
    user.atime = user.ctime;

    dbConf.con.then(function(db) {
        //check if username exist
        return db.collection('user').find({
                username: user.username
            }).toArray()
            .then(function(findRes) {
                if (!findRes || findRes.length > 0) {
                    return {
                        ok: 0,
                        msg: 'username exist'
                    };
                }

                return db.collection('user').insertOne(user)
                    .then(function(insertRes) {
                        if (insertRes.result.ok) {
                            return {
                                ok: 1
                            };
                        }
                        return {
                            ok: 0,
                            msg: 'insert error'
                        };
                    });
            });

    }).then(function(newRes) {

        if (!newRes.ok) {
            res.json(newRes.msg);
            res.end();
            return;
        }

        //authenticate here
        passport.authenticate('local', function(err, user, info) {
            console.log(req.cookies);
            if (err) {
                next(err);
                return;
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                
                res.json({
                    ok: 1,
                    user: user
                });
                res.end();
            });

        })(req, res);
    });
});



module.exports = router;
