//import packages
var nodemailer = require('nodemailer');
var smtp_transport = require('nodemailer-smtp-transport');

//import email configuration.
var config = require('../email/config');

//create a transport
smtp_transport = nodemailer.createTransport(smtp_transport({
    host: config.email.host,
    secure: config.email.secure,
    port: config.email.port,
    // service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));

//define the function for using.
var sendMail = function (recipient, subject, html) {
    smtp_transport.sendMail({
        from: config.email.user,
        to: recipient,
        subject: subject,
        html: html
    }, function (err, response) {
        if (err) {
            console.log(err);
        }else{
            console.log("send successfully.");
        }
    });
}

module.exports = sendMail;