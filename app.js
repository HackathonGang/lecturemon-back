const { response } = require('express');
const express = require('express');
const app = express();
const classes = require('./classes');

app.use(express.static('client'));
app.use(express.json());

const Teams = [new classes.Team('Sample Team', ['Counter Strike: Global Offensive'], ['Player 1', 'Player 2', 'Player 3', 'Player 4'])];
const Tournaments = [new classes.Tournament('Sample Tournament', ['Counter Strike: Global Offensive'], ['Team 1', 'Team 2'])];

app.get('/', function (req, resp) {
    try {
        resp.sendFile('./client/page.html', { root: __dirname });
    } catch {
        resp.sendStatus(400);
    }
});

app.get('/teams', function (req, resp) {
    try {
    resp.json(Teams);
    } catch {
        resp.sendStatus(400);
    }
});

app.get('/tournaments', function (req, resp) {
    try {
        resp.json(Tournaments);
    } catch {
        resp.sendStatus(400);
    }
});

app.get('/teams/:teamnumber', function (req, resp) {
    const teamnumber = req.params.teamnumber;
    if (teamnumber >= Teams.length) {
        resp.sendStatus(404);
    }
    resp.json(Teams[teamnumber]);
});

app.get('/tournaments/:tournamentnumber', function (req, resp) {
    const tournamentnumber = req.params.tournamentnumber;
    if (tournamentnumber >= Tournaments.length) {
        resp.sendStatus(404);
    }
    resp.json(Tournaments[tournamentnumber]);
});

app.post('/teams/add', function (req, resp) {
    try {
        const teamname = req.body.teamname;
        const teamgames = req.body.teamgames;
        const teamplayers = req.body.teamplayers;
        Teams.push(new classes.Team(teamname, teamgames, teamplayers));
        resp.sendStatus(200);
    } catch {
        resp.sendStatus(400);
    }
});

app.post('/tournament/add', function (req, resp) {
    try {
        const tournamentname = req.body.tournamentname;
        const tournamentgame = req.body.tournamentgame;
        const tournamentteams = req.body.tournamentteams;
        Tournaments.push(new classes.Tournament(tournamentname, tournamentgame, tournamentteams));
        resp.sendStatus(200);
    } catch {
        resp.sendStatus(400);
    }
});

app.post('/update', function (req, resp) {
    try {
        const round = req.body.round;
        const match = req.body.match;
        const winner = req.body.winner;
        const tournament = req.body.tournamentnumber;
        Tournaments[tournament].updateRounds(round, match, winner);
        resp.sendStatus(200);
    } catch {
        resp.sendStatus(400);
    }
});

app.get('*', function (req, resp) {
    resp.redirect('/');
});

module.exports = app;
