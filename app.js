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

module.exports = app;