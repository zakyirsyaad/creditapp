const express = require('express');
const axios = require('axios');
const mysql = require("mysql2");
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: "34.101.207.105",
    user: "root",
    password: "bangkit",
    database: "creditapp_db",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Connected to the database");
    }
});

app.post('/prediction', async (req, res) => {
    const prediction = req.body
    try {
        const response = await axios.post('https://creditapp-64tbubeb5q-et.a.run.app/predict', prediction);

        const predictionStatus = response.data.prediction[0];

        let resultText;
        if (predictionStatus === 0) {
            resultText = "Denied";
        } else if (predictionStatus === 1) {
            resultText = "Accept";
        } else {
            resultText = "Unknown";
        }

        res.json({ prediction: resultText });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

app.get('/getPrediction', async (req, res) => {

})

app.get('/', async (req, res) => {
    res.json("Welcome Credit Prediction APi")
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
