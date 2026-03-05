const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

let db;

/* Skip DB connection during CI pipeline */
if (process.env.NODE_ENV !== "test") {

    db = mysql.createConnection({
        host: 'database-1.c7smskkuyhek.us-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'Ajesh123',
        database: 'companyportal',
        port: 3306,
        connectTimeout: 10000
    });

    db.connect(err => {

        if (err) {
            console.error("❌ Database connection failed:", err.message);
        } else {
            console.log("✅ Connected to Amazon RDS MySQL");
        }

    });

}

/* Login API */
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    console.log("Login request:", username);

    const query = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    db.query(query, [username, password], (err, result) => {

        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ status: "error" });
        }

        if (result.length > 0) {
            console.log("Login success");
            res.json({ status: "success" });
        } else {
            console.log("Login failed");
            res.json({ status: "fail" });
        }

    });

    /* Register API */
app.post('/register', (req, res) => {

    const { username, password } = req.body;

    const checkUser = "SELECT * FROM users WHERE username = ?";

    db.query(checkUser, [username], (err, result) => {

        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.length > 0) {
            res.json({ status: "user_exists" });
        } 
        else {

            const insertUser = "INSERT INTO users (username, password) VALUES (?, ?)";

            db.query(insertUser, [username, password], (err, result) => {

                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.json({ status: "user_created" });

            });

        }

    });

});

});


/* Test route */
app.get('/', (req, res) => {
    res.send("Backend running");
});


/* Start server */
app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});