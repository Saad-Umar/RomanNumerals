'use strict'

var express = require('express');



var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('express-formidable');
var session = require('express-session');


//The following are to be properly encapsulated, later.
var firebase = require('firebase-admin');
var request = require('request');
var API_KEY = "AIzaSyA_6Gp_rOM9oX43UUtcTZTWxDqNAnVBQKo";
var serviceAccount = require("./config/top-5-b89d2-firebase-adminsdk-a3i8k-0bc64d4ba6.json");


require('newrelic');


// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://top-5-b89d2.firebaseio.com"
});
var ref = firebase.database().ref();

function listenForNotificationRequests() {
    var requests = ref.child('push_notifications');
    requests.on('child_added', function(requestSnapshot) {
        var request = requestSnapshot.val();
        var message = "";

        if (request.type == 0) {
            message += request.sender;
            if (request.action == 0) {
                message += " disagreed with your review."
            } else {
                message += " agreed with your review."
            }
        } else if (request.type == 1 ) {
            message += "Congratulations, you just earned 1000 points in your prime voucher.\nTap here to open your wallet."
        }
        sendNotificationToUser(
            request.recipient,
            message,
            function() {
                requestSnapshot.ref.remove();
            }
        );
    }, function(error) {
        console.error(error);
    });
};

function sendNotificationToUser(username, message, onSuccess) {
    console.log(username);
    console.log('/topics/user_'+username);
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type' :' application/json',
            'Authorization': 'key='+API_KEY
        },
        body: JSON.stringify({
            notification: {
                body: message,
                icon: "notification_iconc",
            },
            to : '/topics/user_'+username
        })
    }, function(error, response, body) {
        if (error) { console.error(error); }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage);
        }
        else {
            onSuccess();
        }
    });
}

// start listening
listenForNotificationRequests();



var configDB = require('./config/database.js');


//The following has been commented out because atm only push service is needed, so no need to connect with mongo
//mongoose.connect(configDB.url);



app.use(morgan('dev'));
app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

app.use(session({secret: 'ilovenodejs'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);
require('./app/routes')(app,passport);

app.listen(port);
console.log('Up and running on port: ' + port);