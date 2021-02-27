//Routing and Session Stuff
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const validator = require('validator');
const bcrypt = require('bcrypt');

app.use(express.json());
const Unis = ['durham', 'warwick'];

app.post('/api/signup', function(req, resp) {
    //Validating Name
    if (!(req.body.name) || !(/^[a-zA-Z]+$/.test(req.body.name))) {
        resp.json({"error-field":"name", "error": "Need a valid name"});
    }
    //Validating Password
    if (!(req.body.name) || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(req.body.password))) {
        resp.json({"error-field":"password", "error": "Need a valid password (minimum length 8, must have at least one uppercase, lowercase, number and symbol)"});
    }
    //Validating Uni
    if (!Unis.includes((req.body.uni).toLowerCase())) {
        resp.json({"error-field":"uni", "error": "Need a valid Uni"});
    }
    //Validating Uni Email
    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.ac.uk$/.test(req.body.uniemail)) || !(req.body.uniemail.includes(req.body.uni))) { //Add check for uni email address to selected uni
        resp.json({"error-field":"uniemail", "error": "Need a valid uni Email"});
    }
    /*db.get(`SELECT uni_email FROM users WHERE uni_email = ${req.body.uniemail}`, function (row) {
        if (row != undefined) {
            resp.json({"error-field":"uniemail", "error": "Uni Email already in use"});
        }
    });*/
    //Validating User Email
    if (!req.body.useremail) {
        req.body.useremail = user.body.uniemail;
    }
    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(req.body.useremail))) {
        resp.json({"error-field":"useremail", "error": "Need a User Email"});
    }
    //Splitting Name
    const first_name = req.body.name.split(' ')[0];
    let last_name = '';
    if (req.body.name.split(' ')[1]) {
        last_name = req.body.name.replace(req.body.name.split(' ')[0], '');
    }
    //Adding data to database
    /*bcrypt.hash(req.body.password, 10, function(err, hash) {
        db.run(`INSERT INTO users (first_name, last_name, uni_email, contact_email, password)
        VALUES (${first_name}, ${last_name}, ${req.body.uniemail}, ${req.body.useremail}, ${hash}));`)
    });*/
    //Sending OK response
    resp.sendStatus(200);
});

/*app.post('/api/signin', function(req, resp) {
    if (!(validator.isEmail(req.body.uniemail)) || !(validator.contains(req.body.uniemail, '.ac.uk'))) { //Add check for uni email address to selected uni
        resp.json({"error-field":"uniemail", "error": "Need a valid uni Email"});
    }
    if (!req.body.password) {
        resp.json({"error-field":"password", "error": "Need to enter a password"});
    }
    db.get(`SELECT uni_email, password FROM users WHERE uni_email = ${req.body.uniemail}`, function (row) {
        if (row == undefined) {
            resp.json({"error-field":"uniemail", "error": "Uni Email not found"});
        }
        else {
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                bcrypt.compare(row.password, hash, function(err, result) {
                    if (result) {

                    }
                    else {
                        resp.json({"error-field":"password", "error": "Incorrect Password"});
                    }
                })
            });
        }
    });
});*/

module.exports = app;