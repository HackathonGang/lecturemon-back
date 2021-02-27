//Routing and Session Stuff
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const bcrypt = require('bcrypt');
const cors = require('cors');
const json = require('body-parser');
const FileStore = require('session-file-store')(session);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: '4dcb417e-381e-42cf-8f6a-5f0244bddb3c',
    resave: false,
    saveUninitialized: false,
    store: new FileStore,
    cookie: { maxAge: 3600000,secure: false, httpOnly: true }
}))

//Database Stuff
const path = require('path');
const dbPath = path.resolve(__dirname, 'data/data.db');
const sqlite3 = require('sqlite3').verbose(); // verbose gives longer traces in case of error
const extPath = path.resolve(__dirname, 'data/json1.so');
  
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT,
        uni_email TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        password TEXT NOT NULL,
        year_group INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS module_lookup (
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        status INTEGER NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS modules (
        module_id INTEGER PRIMARY KEY,
        uni_id INTEGER NOT NULL,
        module_code TEXT NOT NULL,
        lecturer_id INTEGER NOT NULL
    )`); // in future add course_id and year?
    db.run(`CREATE TABLE IF NOT EXISTS lecturers ( 
        lecturer_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS lectures ( 
        lecture_id INTEGER PRIMARY KEY,
        module_id INTEGER NOT NULL,
        start_date_time TEXT NOT NULL,
        end_date_time TEXT NOT NULL,
        survey_sent INTEGER NOT NULL
    )`); // maybe, instead we have a table that has un-sent lectures - delete rows after email sent? - check when db updated
    // db.run(`CREATE TABLE IF NOT EXISTS courseworks ( 
    //     coursework_id INTEGER PRIMARY KEY,
    //     module_id INTEGER NOT NULL,
    //     start_date_time TEXT NOT NULL,
    //     start_date_time TEXT NOT NULL,
    //     survey_sent INTEGER NOT NULL
    // );`);
    db.run(`CREATE TABLE IF NOT EXISTS survey_templates (
        template_id INTEGER PRIMARY KEY,
        format TEXT NOT NULL
    )`); // use a standard format described here: [] to format the strings?
    db.run(`CREATE TABLE IF NOT EXISTS surveys (
        survey_id INTEGER PRIMARY KEY,
        survey_template INTEGER NOT NULL,
        date_time TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS lecture_responses (
        response_id INTEGER PRIMARY KEY,
        lecture_id INTEGER NOT NULL,
        survey_id INTEGER  NOT NULL,
        response TEXT NOT NULL
    )`);
    // db.run(`CREATE TABLE IF NOT EXISTS coursework_responses (
    //     response_id INTEGER PRIMARY KEY,
    //     coursework_id INTEGER NOT NULL,
    //     module_id INTEGER NOT NULL,
    //     survey_id INTEGER  NOT NULL,
    //     response TEXT NOT NULL
    // );`);
    db.run(`CREATE TABLE IF NOT EXISTS module_responses (
        response_id INTEGER PRIMARY KEY,
        module_id INTEGER NOT NULL,
        survey_id INTEGER  NOT NULL,
        response TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS unis (
        uni_id INTEGER PRIMARY KEY,
        extension TEXT NOT NULL,
        name TEXT NOT NULL
    )`);
  
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
});

const Unis = ['durham', 'warwick'];

app.post('/api/signup', function(req, resp) {
    errorlist = [];
    errors = [[0, 'name', 'Need a valid name'],
    [0, 'password', 'Need a valid password (minimum length 8, must have at least one uppercase, lowercase, number and symbol)'],
    [0, 'uni', 'Need a valid Uni'],
    [0, 'uniemail', 'Need a valid uni Email'],
    [0, 'uniemail', 'Email already in use'],
    [0, 'useremail', 'Need a contact Email'],];
    //Validating Name
    if (!(req.body.name) || !(/^[a-zA-Z\s]+$/.test(req.body.name))) {
        errors[0][0] = 1;
    }
    //Validating Password
    if (!(req.body.password) || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(req.body.password))) {
        errors[1][0] = 1;
    }
    //Validating Uni
    if (!Unis.includes((req.body.uni).toLowerCase())) {
        errors[2][0] = 1;
    }
    //Validating Uni Email
    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.ac.uk$/.test(req.body.uniemail)) || !(req.body.uniemail.includes(req.body.uni))) { //Add check for uni email address to selected uni
        errors[3][0] = 1;
    }
    db.get(`SELECT uni_email FROM users WHERE uni_email = ${req.body.uniemail}`, function (row) {
        if (row != undefined) {
            errors[4][0] = True;
        }
    });
    //Validating User Email
    if (!req.body.useremail) {
        req.body.useremail = user.body.uniemail;
    }
    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(req.body.useremail))) {
        errors[5][0] = 1;
    }

    for (let error = 0; error < errors.length; error++) {
        if (errors[error][0] == 1) {
            errorlist.push({error:errors[error][2], errorField:errors[error][1]})
        }
    }

    if (errorlist.length > 0) {
        resp.status(400).json(errorlist);
        return;
    }
    //Splitting Name
    const first_name = req.body.name.split(' ')[0];
    let last_name = '';
    if (req.body.name.split(' ')[1]) {
        last_name = req.body.name.replace(req.body.name.split(' ')[0], '');
    }
    //Adding data to database
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        db.run(`INSERT INTO users (first_name, last_name, uni_email, contact_email, password)
        VALUES (${first_name}, ${last_name}, ${req.body.uniemail}, ${req.body.useremail}, ${hash}));`)
    });
    //Sending OK response
    resp.sendStatus(200);
});

app.post('/api/signin', function(req, resp) {
    if (!(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.ac.uk$/.test(req.body.uniemail))) {
        resp.json({"error-field":"uniemail", "error": "Need a valid uni Email"});
    }
    if (!req.body.password) {
        resp.json({"error-field":"password", "error": "Need to enter a password"});
    }
    db.get(`SELECT uni_email, password, user_id, name FROM users WHERE uni_email = ${req.body.uniemail}`, function (row) {
        if (row == undefined) {
            resp.json({"error-field":"uniemail", "error": "Uni Email not found"});
        }
        else {
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                bcrypt.compare(row.password, hash, function(err, result) {
                    if (result) {
                        req.session = {userid: row.user_id};
                        resp.status(200).json({"name": row.name, "id":row.user_id});
                    }
                    else {
                        resp.status(400).json({"error-field":"password", "error": "Incorrect Password"});
                    }
                });
            });
        }
    });
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
      "answers": {
        "type": "array",
        "items": 
          {
            "type": "string"
          }
      }
    },
    "required": [
      "survey_id",
      "target",
      "target_type",
      "answers"
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

app.get('/api/timetable', function(req, resp) {
    // returns users lectures in the following form:
    // {
    //      "module_code": [(lecture1_starttime, lecture1_endtime), (lecture2_starttime, lecture2_endtime)],
    //      "module_code": ...    
    //}


    // grab module IDs from module_lookup
    // grab their start/end/names times from module
    // return a json containging module name, list of tuples for lectures
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READ, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    let moduleIDs = [];
    let jsonDict = {};
    
    db.serialize(() =>{
        db.each(`SELECT (module_id) FROM module_lookup WHERE user_id = ${req.user_id}`, (err, row) => {
            moduleIDs.push(row[0]);
        });
        moduleIDs.forEach(id => {
            let code = db.get(`SELECT (module_code) FROM modules WHERE module_id = ${id}`)[0];
            jsonDict[code] = [];
            db.each(`SELECT (date_time_start, date_time_end) FROM lectures WHERE module_id = ${id}`, (err, row) => {
                jsonDict[code].push((row[0], row[1]));
            });
        });
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    resp.status(200);
    resp.send(JSON.stringify(jsonDict));
});

app.post('/api/surveyresponse', function(req, resp) {
    if (v.validate(req, responseSchema)) {
        let survey_id   = req.survey_id;
        let target      = req.target;
        let target_type = req.target_type;
        if (target_type == "lecture") {
            let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    return console.error(err.message);
                }
            });

            db.serialize(() => {
                db.run(`INSERT INTO lecture_responses 
                (lecture_id, survey_id, response) VALUES 
                (${target},  "${survey_id}", ${req.answers});`);
            });

        } else if (target_type == "module") {
            let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    return console.error(err.message);
                }
            });

            db.serialize(() => {
                db.run(`INSERT INTO module_responses 
                (module_id, survey_id, response) VALUES 
                (${target},  "${survey_id}", ${req.answers});`);
            });

        } else {
            resp.status("422").send('Invalid rating type, can only rate "lecture" or "module');
        }


        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });

    } else {
        resp.status("422").send("Invalid JSON sent for survey response");
    }
    resp.status("200").send("Successfuly recorded response");

});

function addTemplate(title, description, target, target_type, questions) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    let structure = {
        "survey_title": title,
        "survey_description": description,
        "target": target,
        "target_type": target_type,
        "questions": questions
    }


    // console.log(`INSERT INTO survey_templates (format) VALUES ("${escape(JSON.stringify(structure))}")`);
    let jsonString = escape(JSON.stringify(structure));
    console.log(jsonString);
    // db.loadExtension(extPath);

    db.serialize(() => {
        db.run(`INSERT INTO survey_templates (format) VALUES ("${jsonString}")`);
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}


// addTemplate("Regular survey for [module code]", "", "[module_id]", "lecture", ["How much did you enjoy this lecture?", "slider", [1,5,1,"Not at all", "It was amazing!"]]);

module.exports = app;