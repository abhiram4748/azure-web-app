const express = require("express");
const cors = require("cors");
const sql = require("mssql");
require("dotenv").config();

const app = express();
// CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173", // Local frontend
        "https://ashy-sea-090fda60f.4.azurestaticapps.net"
    ],
    credentials: true
}));
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ashy-sea-090fda60f.1.azurestaticapps.net"
    ],
    credentials: true
}));

/* SQL CONNECTION */
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

// Connect to Database
sql.connect(sqlConfig)
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

/* GET PRODUCT BY ID */
app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Products WHERE id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).send("Product not found");
        }
        res.json(result.recordset[0]);
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

/* GET USER ORDERS */
app.get("/orders", async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).send("User ID required");

    try {
        const result = await sql.query`
            SELECT o.id, o.total_amount, o.status, o.created_at,
                   oi.productId, oi.quantity, oi.price, oi.size,
                   p.name, p.image_url
            FROM Orders o
            JOIN OrderItems oi ON o.id = oi.order_id
            JOIN Products p ON oi.productId = p.id
            WHERE o.userId = ${userId}
            ORDER BY o.created_at DESC
        `;

        // Group items by order
        const ordersMap = new Map();
        result.recordset.forEach(row => {
            if (!ordersMap.has(row.id)) {
                ordersMap.set(row.id, {
                    id: row.id.toString(),
                    totalAmount: row.total_amount,
                    status: row.status,
                    createdAt: row.created_at,
                    items: []
                });
            }
            ordersMap.get(row.id).items.push({
                productId: row.productId,
                quantity: row.quantity,
                price: row.price,
                size: row.size,
                title: row.name,
                image: row.image_url
            });
        });

        res.json(Array.from(ordersMap.values()));
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch orders");
    }
});

/* SYNC USER */
app.post("/users", async (req, res) => {
    const { id, email, name } = req.body;
    if (!id || !email) return res.status(400).send("ID and Email required");

    try {
        // Check if user exists
        const check = await sql.query`SELECT id FROM Users WHERE id = ${id}`;
        if (check.recordset.length === 0) {
            await sql.query`
                INSERT INTO Users (id, email, name)
                VALUES (${id}, ${email}, ${name})
            `;
        } else {
            await sql.query`
                UPDATE Users SET email = ${email}, name = ${name}
                WHERE id = ${id}
            `;
        }
        res.json({ message: "User synced" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to sync user");
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port", PORT));