//Routing and Session Stuff
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');

app.use(express.json);
app.use(session({
    
}))

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
        password TEXT NOT NULL,
        year_group INTEGER
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS module_lookup (
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        status INTEGER NOT NULL
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS modules (
        module_id INTEGER PRIMARY KEY,
        uni_id INTEGER NOT NULL,
        module_code TEXT NOT NULL,
        lecturer_id INTEGER NOT NULL
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS lectures ( 
        lecture_id INTEGER PRIMARY KEY,
        module_id INTEGER NOT NULL,
        start_date_time TEXT NOT NULL,
        start_date_time TEXT NOT NULL,
        survey_sent INTEGER NOT NULL
    );`); // maybe, instead we have a table that has un-sent lectures - delete rows after email sent? - check when db updated
    // db.run(`CREATE TABLE IF NOT EXISTS courseworks ( 
    //     coursework_id INTEGER PRIMARY KEY,
    //     module_id INTEGER NOT NULL,
    //     start_date_time TEXT NOT NULL,
    //     start_date_time TEXT NOT NULL,
    //     survey_sent INTEGER NOT NULL
    // );`);
    db.run(`CREATE TABLE IF NOT EXISTS survey_templates (
        template_id INTEGER PRIMARY KEY,
        questions BLOB NOT NULL
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS surveys (
        survey_id INTEGER PRIMARY KEY,
        survey_template INTEGER NOT NULL,
        date_time TEXT NOT NULL
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS lecture_responses (
        response_id INTEGER PRIMARY KEY,
        lecture_id INTEGER NOT NULL,
        survey_id INTEGER  NOT NULL,
        response BLOB NOT NULL
    );`);
    // db.run(`CREATE TABLE IF NOT EXISTS coursework_responses (
    //     response_id INTEGER PRIMARY KEY,
    //     coursework_id INTEGER NOT NULL,
    //     module_id INTEGER NOT NULL,
    //     survey_id INTEGER  NOT NULL,
    //     response BLOB NOT NULL
    // );`);
    db.run(`CREATE TABLE IF NOT EXISTS module_responses (
        response_id INTEGER PRIMARY KEY,
        module_id INTEGER NOT NULL,
        survey_id INTEGER  NOT NULL,
        response BLOB NOT NULL
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS unis (
        uni_id INTEGER PRIMARY KEY,
        extension TEXT NOT NULL
    );`);
});


db.close((err) => {
 if (err) {
     return console.error(err.message);
 }
});

const Users = [];

var Validator = require('jsonschema').Validator;
var v = new Validator();

var responseSchema = {
    "type": "object",
    "properties": {
      "survey_id": {
        "type": "integer"
      },
      "target": {
        "type": "integer"
      },
      "target_type": {
        "type": "string",
        "pattern": "(lecture|module)"
      },
      "questions": {
        "type": "array",
        "items": [
          {
            "type": "string"
          }
        ]
      }
    },
    "required": [
      "survey_id",
      "target",
      "target_type",
      "questions"
    ]
  }

app.post('/api/signup', function(req, resp) {
    if (!req.body.name || !req.body.password || !req.body.confirmpassword || !req.body.uniemail || !req.body.useremail) {
        resp.json()
    } else if (req.body.password != req.body.confirmpassword) {
        resp.status('400');
        resp.send("Password is not equal to confirm password");
    }

    const uni = (req.body.uniemail.split('@')[1]).split('.')[0];
    const name = req.body.name;
    const password = req.body.password
    if (password != /fa/) {
        resp.json({'error-field':'password', 'error': 'Need to follow format'})
    }
});

app.response('/api/surveyresponse', function(req, resp) {



    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });



    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
});


module.exports = app;