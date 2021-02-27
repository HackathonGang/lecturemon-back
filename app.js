//Routing and Session Stuff
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const validator = require('validator');

app.use(express.json);
app.use(session({
    
}))

const Unis = ['durham', 'warwick'];

app.post('/api/signup', function(req, resp) {
    if (!(req.body.name) || !(validator.isAlphanumeric(req.body.name))) {
        resp.json({"error-field":"name", "error": "Need a valid name"});
    }
    if (!validator.isStrongPassword(req.body.password)) {
        resp.json({"error-field":"password", "error": "Need a valid password (minimum length 8, must have at least one uppercase, lowercase and symbol)"});
    }
    if (!Unis.includes((req.body.uni).toLowerCase())) {
        resp.json({"error-field":"uni", "error": "Need a valid Uni"});
    }
    if (!(validator.isEmail(req.body.uniemail)) || !(validator.contains(req.body.uniemail, '.ac.uk'))) { //Add check for uni email address to selected uni
        resp.json({"error-field":"uniemail", "error": "Need a valid uni Email"});
    }
    if (validator.isEmpty(req.body.useremail)) {
        req.body.useremail = user.body.uniemail;
    }
    if ((!validator.isEmpty(req.body.useremail)) && (!validator.isEmail(req.body.useremail))) {
        resp.json({"error-field":"useremail", "error": "Need a User Email"});
    }
    
    const first_name = req.body.name.split(' ')[0];
    if (req.body.name.split(' ')[1] == undefined) {
        const last_name = '';
    }
    else {
        const last_name = req.body.name.replace(req.body.name.split(' ')[0], '');
    }
    const password = req.body.password;
    db.run(`INSERT INTO users (first_name, last_name, uni_email, contact_email, password)
        VALUES (${first_name}, ${last_name}, ${req.body.uniemail}, ${req.body.useremail}, )
    );`);
});

app.post('/api/signin'), function(req, resp) {
    if (!(validator.isEmail(req.body.uniemail)) || !(validator.contains(req.body.uniemail, '.ac.uk'))) { //Add check for uni email address to selected uni
        resp.json({"error-field":"uniemail", "error": "Need a valid uni Email"});
    }
    // Database comparing stuff for username and password
}

//Database Stuff
const path = require('path');
const e = require('express');
const dbPath = path.resolve(__dirname, 'data/data.db');
const sqlite3 = require('sqlite3').verbose(); // verbose gives longer traces in case of error

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        uni_email TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        year_group INTEGER
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS module_lookup (
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        status INTEGER NOT NULL
    );`);
});


db.close((err) => {
 if (err) {
     return console.error(err.message);
 }
});

module.exports = app;