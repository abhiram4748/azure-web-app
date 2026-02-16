require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

sql.connect(dbConfig)
    .then(() => console.log("Azure SQL Connected ✅"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.get("/api/test", async (req, res) => {
    try {
        const result = await sql.query`SELECT GETDATE() as time`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});