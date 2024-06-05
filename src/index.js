const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'credit_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.post('/prediction', async (req, res) => {
    const { id } = req.body;

    db.query('SELECT * FROM CreditApplication WHERE id = ?', [id], async (err, results) => {
        if (err) {
            res.status(500).send('Database query error');
        } else if (results.length === 0) {
            res.status(404).send('Credit application not found');
        } else {
            const application = results[0];

            try {
                const response = await axios.post('http://localhost:5000/predict', application);
                res.json(response.data);
            } catch (error) {
                res.status(500).send('Prediction service error');
            }
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
