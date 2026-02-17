import sql from "mssql";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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
        connectTimeout: 15000
    }
};

(async () => {
    const resultLog = { timestamp: new Date().toISOString() };
    try {
        console.log("Connecting...");
        await sql.connect(dbConfig);
        console.log("✅ SUCCESS");
        const result = await sql.query`SELECT @@VERSION as version`;
        resultLog.success = true;
        resultLog.version = result.recordset[0].version;
        await sql.close();
    } catch (err) {
        console.error("❌ FAILED");
        resultLog.success = false;
        resultLog.error = {
            name: err.name,
            message: err.message,
            code: err.code,
            originalError: err.originalError ? {
                message: err.originalError.message
            } : null
        };
    }
    fs.writeFileSync(path.join(__dirname, 'db_test_result.json'), JSON.stringify(resultLog, null, 2));
})();
