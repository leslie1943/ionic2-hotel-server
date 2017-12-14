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
var Leave = mongoose.model('leaves', {
    leave_id: String,
    leave_requester: String,
    leave_pm: String,

    leave_type: String,
    leave_from: String,
    leave_to: String,
    leave_days: String,
    leave_backup: String,
    leave_contact: String,
    leave_reason: String
});

//Routes - user register
app.post('/api/leave/create', function (req, res) {

    console.log("[LOG]: Create new leave starting...");

    // var md5 = crypto.createHash('md5');

    var new_leave = new Leave({
        leave_id: req.body.leave_id,
        leave_requester: req.body.leave_requester,
        leave_pm: req.body.leave_pm,
        leave_type: req.body.leave_type,
        leave_from: req.body.leave_from,
        leave_to: req.body.leave_to,
        leave_days: req.body.leave_days,
        leave_backup: req.body.leave_backup,
        leave_contact: req.body.leave_contact,
        leave_reason: req.body.leave_reason,
    });

    new_leave.save(function (err, new_leave) {
        if (err) {
            res.send(err);
        } else {
            // sendMail('leslie43@sina.com','Hello Node','<b>Thanks!</b>');
            // mail(newUser["email"], 'Hello Node', '<b>Thanks!</b>');
            //return result to application from node server side.
            res.json(new_leave);
            console.log("[LOG]: The new user id is: " + new_leave._id);
        }
    });

    console.log("[LOG]: Create new leave finishing...");
});


module.exports = app;