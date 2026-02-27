const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* RDS MySQL connection */
const db = mysql.createConnection({
    host: 'database-1.c7smskkuyhek.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Ajesh123',
    database: 'companyportal',
    port: 3306
});

/* Connect to DB */
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to Amazon RDS MySQL');
});

/* Test route */
app.get('/', (req, res) => {
    res.send('Backend running with RDS');
});

/* Login API */
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    const query = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    db.query(query, [username, password], (err, result) => {

        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.length > 0) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }

    });

});

/* Timesheet API */
app.post('/timesheet', (req, res) => {

    const { username, date, hours, task } = req.body;

    const query = `
        INSERT INTO timesheets (username, work_date, hours, task)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [username, date, hours, task], (err, result) => {

        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json({ status: "timesheet saved" });

    });

});

/* Leave request API */
app.post('/leave', (req, res) => {

    const { username, from_date, to_date, reason } = req.body;

    const query = `
        INSERT INTO leaves (username, from_date, to_date, reason)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [username, from_date, to_date, reason], (err, result) => {

        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json({ status: "leave submitted" });

    });

});

/* Start server */
app.listen(3000, () => {
    console.log("Backend running on port 3000");
});