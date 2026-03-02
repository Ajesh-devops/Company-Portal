const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

/* Start server FIRST */
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

/* Skip DB connection in CI */
if (process.env.NODE_ENV !== "test") {

    const db = mysql.createConnection({
        host: 'database-1.c7smskkuyhek.us-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'Ajesh123',
        database: 'companyportal',
        port: 3306,
        connectTimeout: 10000
    });

    db.connect(err => {
        if (err) {
            console.error('Database connection failed:', err.message);
        } else {
            console.log('Connected to Amazon RDS MySQL');
        }
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

}
else {

    console.log("Running in CI mode - skipping database connection");

    app.get('/login', (req, res) => {
        res.json({ status: "CI test mode" });
    });

}

/* Test route */
app.get('/', (req, res) => {
    res.send('Backend running');
});