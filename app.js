//Routing and Session Stuff
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');

app.use(express.json);
app.use(session({
    
}))

const Users = [];

app.post('/api/signup', function(req, resp) {
    if (!req.body.name || !req.body.password || !req.body.confirmpassword || !req.body.uniemail || !req.body.useremail) {
        resp.status('400');
        resp.send("Invalid Details");
    } else if (req.body.password != req.body.password) {
        resp.status('400');
        resp.send("Password is not equal to confirm password");
    }

    const uni = (req.body.uniemail.split('@')[1]).split('.')[0];
    const name = req.body.name;
    const password = 
});

//Database Stuff
const path = require('path');
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