import sql from "mssql";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        connectTimeout: 15000 // 15 seconds
    }
};

console.log("Testing connection to:");
console.log(`Server: ${dbConfig.server}`);
console.log(`User: ${dbConfig.user}`);
console.log(`Database: ${dbConfig.database}`);

(async () => {
    try {
        console.log("Connecting...");
        await sql.connect(dbConfig);
        console.log("✅ SUCCESS: Connected to Azure SQL Database!");
        const result = await sql.query`SELECT @@VERSION as version`;
        console.log("DB Version:", result.recordset[0].version);
        await sql.close();
    } catch (err) {
        console.error("❌ FAILED: Could not connect.");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        console.error("Error Code:", err.code); // ELOGIN, ETIMEOUT, etc.
        if (err.originalError) {
            console.error("Original Error info:", err.originalError.info);
            console.error("Original Error message:", err.originalError.message);
        }
    }
})();
