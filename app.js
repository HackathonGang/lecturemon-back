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

module.exports = app;