const express = require("express");
const cors = require("cors");
const sql = require("mssql");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* SQL CONNECTION */
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Connect to Database
sql.connect(dbConfig)
    .then(() => console.log("Azure SQL Connected ✅"))
    .catch(err => console.error("Database Connection Error:", err));


/* TEST ROUTE */
app.get("/", (req, res) => {
    res.send("Azure Backend Running");
});

/* GET PRODUCTS */
app.get("/products", async (req, res) => {
    try {
        // await sql.connect(dbConfig); // Removed: Connection is established at startup
        const result = await sql.query`SELECT * FROM Products`;
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send("Database error");
    }
});

/* ADD TO CART */
app.post("/cart", async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // await sql.connect(dbConfig); // Removed: Connection is established at startup
        await sql.query`
            INSERT INTO Cart (userId, productId, quantity)
            VALUES (${userId}, ${productId}, ${quantity})
        `;
        res.send("Added to cart");
    } catch (err) {
        console.log(err);
        res.status(500).send("Cart insert failed");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));