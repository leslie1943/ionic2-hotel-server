var mongoose = require('mongoose');
var express = require('express');
var user_group = require('../models/user_group');

var mail = require('../email/mail');

//encrypt module
var crypto = require('crypto');

var app = express();

//param
function parFormat(param) {
    return new RegExp("^.*" + param + ".*$");
}

//Object model
var User = mongoose.model('users', {
    email: String,
    serial: String,
    firstname: String,
    lastname: String,
    role: String,
    nick: String,
    birth: String,
    mobile: String,
    password: String,
    reg_date: String,
    icon: Object
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
        role: req.body.role,
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
            //Duplicated validation.
            if (user) {
                //return result to application from node server side.
                res.json({ "ERROR": "Duplicated", "MSG": "This email has been registered already." });
            }
            //Existing validation.
            else if (!user_group[newUser["email"]]["exist"]) {
                res.json({ "ERROR": "Invalid", "MSG": "This email is NOT valid!" });
            }
            //Email validation.
            else if (user_group[newUser["email"]]["exist"]) {

                //Email mapping serail number - Failure
                if (user_group[newUser["email"]]["serial"] !== req.body.serial) {
                    res.json({ "ERROR": "Invalid", "MSG": "This email and serial number not matched!" });
                }

                if (user_group[newUser["email"]]["role"] !== req.body.role) {
                    res.json({ "ERROR": "Invalid", "MSG": "Wrong role!" });
                }
                //Email mapping serail number - Success
                else {
                    newUser.save(function (err, new_user) {
                        if (err) {
                            res.send(err);
                        } else {
                            // sendMail('leslie43@sina.com','Hello Node','<b>Thanks!</b>');
                            mail(newUser["email"], 'Hello Node', '<b>Thanks!</b>');
                            //return result to application from node server side.
                            res.json(new_user);
                            console.log("[LOG]: The new user id is: " + new_user._id);
                        }
                    });
                }
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
    console.log("[LOG]: Search users list starting...");

    var condition = {};

    //Query creterials - email
    if (req.body.email) {
        condition.email = parFormat(req.body.email);
    }
    //Query creterials - sn
    if (req.body.serial) {
        condition.serial = parFormat(req.body.serial);
    }
    //Query creterials - first name
    if (req.body.firstname) {
        condition.firstname = parFormat(req.body.firstname);
    }
    //Query creterials - last name
    if (req.body.lastname) {
        condition.lastname = parFormat(req.body.lastname);
    }
    //Query creterials - mobile
    if (req.body.mobile) {
        condition.mobile = parFormat(req.body.mobile);
    }

    User.find(condition, function (err, users) {
        if (err) {
            res.send(err);
        } else {
            console.log("[LOG]: There are " + users.length + " users be found.");
            console.log("[LOG]: The result is:" + JSON.stringify(users));
            res.json(users);
        }
    });

    console.log("[LOG]: Search users list finishing...");
});

//Routes - user delete
app.post('/api/user/delete', function (req, res) {
    console.log("[LOG]: Delete user starting...");
    User.deleteOne({ _id: req.body._id }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
    console.log("[LOG]: Delete user finishing...");
});

//Routes - user update
app.post('/api/user/update', function (req, res) {
    console.log("[LOG]: Update user starting...");
    console.log("[LOG]: the update user is : " + JSON.stringify(req.body));
    console.log("[XXXXX]: the icon is : " + JSON.stringify(req.body.files));

    var upd_field = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
    };

    User.update({ _id: req.body._id }, {$set: upd_field}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            
            console.log(JSON.stringify(data));
            res.json(data);
        }
    });

    console.log("[LOG]: Update user finishing...");
});

module.exports = app;