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
        // Fetch products with their available sizes
        const result = await sql.query`
            SELECT p.*, 
            (
                SELECT size FROM ProductSizes WHERE product_id = p.id FOR JSON PATH
            ) AS sizes
            FROM Products p
        `;

        // Transform result to include sizes array
        const products = result.recordset.map(product => ({
            ...product,
            sizes: product.sizes ? JSON.parse(product.sizes).map(s => s.size) : []
        }));

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Database error");
    }
});

/* ADD TO CART */
app.post("/cart", async (req, res) => {
    const { userId, productId, quantity, size } = req.body;

    try {
        // await sql.connect(dbConfig); // Removed: Connection is established at startup

        // Check if size is provided
        if (!size) {
            return res.status(400).send("Size is required");
        }

        await sql.query`
            INSERT INTO Cart (userId, productId, quantity, size)
            VALUES (${userId}, ${productId}, ${quantity}, ${size})
        `;
        res.send("Added to cart");
    } catch (err) {
        console.log(err);
        res.status(500).send("Cart insert failed");
    }
});

/* PLACE ORDER */
app.post("/orders", async (req, res) => {
    const { userId, totalAmount, items } = req.body;

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();

        // 1. Create Order
        const orderRequest = new sql.Request(transaction);
        const orderResult = await orderRequest.query`
            INSERT INTO Orders (userId, total_amount, status)
            OUTPUT INSERTED.id
            VALUES (${userId}, ${totalAmount}, 'Pending')
        `;
        const orderId = orderResult.recordset[0].id;

        // 2. Insert Order Items
        for (const item of items) {
            const itemRequest = new sql.Request(transaction);
            await itemRequest.query`
                INSERT INTO OrderItems (order_id, productId, quantity, price, size)
                VALUES (${orderId}, ${item.productId}, ${item.quantity}, ${item.price}, ${item.size})
            `;
        }

        // 3. Commit Transaction
        await transaction.commit();

        res.status(201).json({ message: "Order placed successfully", orderId });

    } catch (err) {
        if (transaction._aborted === false) {
            await transaction.rollback();
        }
        console.error("Order placement error:", err);
        res.status(500).send("Failed to place order");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));