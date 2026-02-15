import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false
    }
};

// Database Connection
const connectToDb = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('AWS WEB API is running');
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Products`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create/Seed Product (Admin)
app.post('/api/products', async (req, res) => {
    try {
        const { id, title, price, description, category, image, stock } = req.body;

        // Basic validation
        if (!title || !price) {
            return res.status(400).json({ error: 'Title and price are required' });
        }

        const result = await sql.query`
            MERGE Products AS target
            USING (SELECT ${id} as id, ${title} as title, ${price} as price, ${description} as description, ${category} as category, ${image} as image_url, ${stock} as stock_quantity) AS source
            ON (target.id = source.id)
            WHEN MATCHED THEN
                UPDATE SET title = source.title, price = source.price, description = source.description, category = source.category, image_url = source.image_url, stock_quantity = source.stock_quantity
            WHEN NOT MATCHED THEN
                INSERT (id, title, price, description, category, image_url, stock_quantity) VALUES (source.id, source.title, source.price, source.description, source.category, source.image_url, source.stock_quantity);
        `;

        res.status(201).json({ message: 'Product saved successfully' });
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).json({ error: 'Failed to save product' });
    }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await sql.query`SELECT * FROM Products WHERE id = ${id}`;

        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Sync User (Create or Update)
app.post('/api/users', async (req, res) => {
    try {
        const { id, email, name } = req.body;
        // Upsert user
        const result = await sql.query`
            MERGE Users AS target
            USING (SELECT ${id} as id, ${email} as email, ${name} as name) AS source
            ON (target.id = source.id)
            WHEN MATCHED THEN
                UPDATE SET name = source.name, email = source.email
            WHEN NOT MATCHED THEN
                INSERT (id, email, name) VALUES (source.id, source.email, source.name);
        `;
        res.json({ message: 'User synced' });
    } catch (err) {
        console.error('Error syncing user:', err);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    const transaction = new sql.Transaction();
    try {
        const { user_id, items, total_amount } = req.body;

        await transaction.begin();

        // 1. Create Order
        const orderRequest = new sql.Request(transaction);
        const orderResult = await orderRequest
            .input('user_id', sql.NVarChar(128), user_id) // Firebase UID
            .input('total_amount', sql.Decimal(10, 2), total_amount)
            .query`INSERT INTO Orders (user_id, total_amount) OUTPUT INSERTED.id VALUES (@user_id, @total_amount)`;

        const orderId = orderResult.recordset[0].id;

        // 2. Create Order Items
        for (const item of items) {
            const itemRequest = new sql.Request(transaction);
            await itemRequest
                .input('order_id', sql.UniqueIdentifier, orderId)
                .input('product_id', sql.Int, item.product_id)
                .input('quantity', sql.Int, item.quantity)
                .input('price', sql.Decimal(10, 2), item.price)
                .query`INSERT INTO OrderItems (order_id, product_id, quantity, price_at_purchase) VALUES (@order_id, @product_id, @quantity, @price)`;
        }

        await transaction.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });

    } catch (err) {
        if (transaction.active) {
            await transaction.rollback();
        }
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get user orders
app.get('/api/orders', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await sql.query`
            SELECT o.id, o.total_amount, o.status, o.created_at,
                   (SELECT count(*) FROM OrderItems oi WHERE oi.order_id = o.id) as item_count
            FROM Orders o
            WHERE o.user_id = ${user_id}
            ORDER BY o.created_at DESC
        `;

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Health Check
app.get('/health', async (req, res) => {
    try {
        const result = await sql.query`SELECT 1 as health`;
        res.json({ status: 'ok', db: result.recordset[0].health === 1 ? 'connected' : 'disconnected' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Initialize connection and start server
connectToDb().then(() => {
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
