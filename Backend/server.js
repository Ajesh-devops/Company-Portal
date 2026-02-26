const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Create database
const db = new sqlite3.Database("company.db");

// Create tables
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS timesheets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            date TEXT,
            hours INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS leaves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            from_date TEXT,
            to_date TEXT,
            reason TEXT
        )
    `);

    // default user
    db.run(`
        INSERT OR IGNORE INTO users (id, username, password)
        VALUES (1, 'admin', 'admin123')
    `);

});

// LOGIN
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, row) => {

            if (row) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }

        }
    );

});

// ADD TIMESHEET
app.post("/timesheet", (req, res) => {

    const { username, date, hours } = req.body;

    db.run(
        "INSERT INTO timesheets (username, date, hours) VALUES (?, ?, ?)",
        [username, date, hours],
        () => {
            res.json({ message: "Timesheet added" });
        }
    );

});

// ADD LEAVE
app.post("/leave", (req, res) => {

    const { username, from_date, to_date, reason } = req.body;

    db.run(
        "INSERT INTO leaves (username, from_date, to_date, reason) VALUES (?, ?, ?, ?)",
        [username, from_date, to_date, reason],
        () => {
            res.json({ message: "Leave request added" });
        }
    );

});

// VIEW TIMESHEETS
app.get("/timesheets/:username", (req, res) => {

    db.all(
        "SELECT * FROM timesheets WHERE username=?",
        [req.params.username],
        (err, rows) => {
            res.json(rows);
        }
    );

});

// VIEW LEAVES
app.get("/leaves/:username", (req, res) => {

    db.all(
        "SELECT * FROM leaves WHERE username=?",
        [req.params.username],
        (err, rows) => {
            res.json(rows);
        }
    );

});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});