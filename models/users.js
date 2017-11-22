var mongoose = require('mongoose');
var express = require('express');

//encrypt module
var crypto = require('crypto');

var app = express();

//Object model
var User = mongoose.model('users', {
    email:String,
    serial: String,
    firstname: String,
    lastname: String,
    nick: String,
    birth: String,
    mobile: String,
    password: String,
    reg_date: String
});

//Routes - user register
app.post('/api/user/register', function (req, res) {

    console.log("[LOG]: User register starting...");

    var md5 = crypto.createHash('md5');

    var newUser = new User({
        email: req.body.email,
        serial: req.body.serial,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nick: req.body.nick,
        birth: req.body.birth,
        mobile: req.body.mobile,
        password: md5.update(req.body.password ? req.body.password : "").digest('hex').toString(),
        reg_date: new Date().toISOString()
    });

    User.findOne({ email: newUser["email"] }, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            if (user) {
                //return result to application from node server side.
                res.json({ "ERROR": "DUPLICATED", "MSG": "THIS NUMBER HAS BEEN REGISTERED ALREADY!" });
            }
            //The user is new.
            else {
                newUser.save(function (err, new_user) {
                    if (err) {
                        res.send(err);
                    } else {
                        //return result to application from node server side.
                        res.json(new_user);
                        console.log("[LOG]: The new user id is: " + new_user._id);
                    }
                });
            }
        }
    });
    console.log("[LOG]: User register finishing...");
});

//Routes - user login
app.post('/api/user/login', function (req, res) {
    console.log("[LOG]: User login starting...");

    var md5 = crypto.createHash('md5');

    User.findOne({
        email: req.body.email,
    }, function (err, user) {
        //The mobile number is valid.
        if (user) {
            if (err) {
                console.send("err:" + err);
            } else {
                console.log(user);
                let out_pwd = md5.update(req.body.password).digest('hex').toString();
                console.log(out_pwd);
                //Compare password - matched.
                if (user.password === out_pwd) {
                    res.json(user);
                }
                //Compare password - not matched.
                else {
                    res.json({ "ERROR": "WRONG_PWD", "MSG": "WRONG PASSWORD" });
                }
            }
        } else {
            res.json(user);
        }
    });
    console.log("[LOG]: User login finishing...");
});

//Routes - user query
app.post('/api/user/query', function (req, res) {
    console.log("[LOG]: Search customer list starting...");

    var condition = {};

    //Query creterials - mobile
    if (req.body.mobile) {
        var pattern = new RegExp("^.*" + req.body.mobile + ".*$");
        condition.mobile = pattern;
    }

    //Query creterials - date
    if (req.body.reg_date) {
        condition.reg_date = { $lt: req.body.reg_date };
    }

    User.find(condition, function (err, customers) {
        if (err) {
            res.send(err);
        } else {
            console.log("[LOG]: There are " + customers.length + " customers be found.");
            res.json(customers);
        }
    });

    console.log("[LOG]: Search customer list finishing...");
});

module.exports = app;