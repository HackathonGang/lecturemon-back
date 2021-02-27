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