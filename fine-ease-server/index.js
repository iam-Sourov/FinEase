const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');
const { Pool } = require('pg');

// Type ID for DATE is 1082. Prevent node-postgres from parsing DATE into a JS Date object in local time/UTC.
pg.types.setTypeParser(1082, (val) => val);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

let pool = null;
let dbInitialized = false;

function getPool() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is missing. Please set DATABASE_URL in Vercel Environment Variables.");
    }
    if (!pool) {
        // Clean query parameters like ?sslmode=require that override rejectUnauthorized settings in node-postgres pg-connection-string
        const cleanDatabaseUrl = databaseUrl.split('?')[0];
        pool = new Pool({
            connectionString: cleanDatabaseUrl,
            ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000
        });
    }
    return pool;
}

async function queryDb(text, params) {
    const activePool = getPool();
    if (!dbInitialized) {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                category VARCHAR(100) NOT NULL,
                amount DOUBLE PRECISION NOT NULL,
                description TEXT,
                date DATE NOT NULL,
                email VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
            CREATE INDEX IF NOT EXISTS idx_transactions_email_date ON transactions(email, date DESC);
        `;
        await activePool.query(createTableQuery);
        dbInitialized = true;
    }
    return await activePool.query(text, params);
}

app.get('/health', (req, res) => {
    res.json({ status: "ok", message: "Server is online and production ready" });
});

app.get('/', async (req, res) => {
    try {
        const result = await queryDb('SELECT * FROM transactions ORDER BY id DESC');
        const transactions = result.rows.map(row => ({
            ...row,
            _id: row.id.toString()
        }));
        res.send(transactions);
    } catch (error) {
        console.error("Error in GET /:", error);
        res.status(500).send({ error: "Database error", message: error.message });
    }
});

app.get('/my-transactions', async (req, res) => {
    const email = req.query.email;
    try {
        let queryText = 'SELECT * FROM transactions';
        let queryParams = [];

        if (email) {
            queryText += ' WHERE email = $1';
            queryParams.push(email);
        }

        queryText += ' ORDER BY date DESC, id DESC';

        const result = await queryDb(queryText, queryParams);
        const transactions = result.rows.map(row => ({
            ...row,
            _id: row.id.toString()
        }));
        res.send(transactions);
    } catch (error) {
        console.error("Error in GET /my-transactions:", error);
        res.status(500).send({ error: "Database error", message: error.message });
    }
});

app.post('/add-Transaction', async (req, res) => {
    const { type, category, amount, description, date, email, name } = req.body;
    
    // Validation
    const parsedAmount = parseFloat(amount);
    if (!type || !category || isNaN(parsedAmount) || !date || !email) {
        return res.status(400).send({ error: "Validation error", message: "Missing or invalid required fields (type, category, amount, date, email)" });
    }

    try {
        const result = await queryDb(
            `INSERT INTO transactions (type, category, amount, description, date, email, name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [type, category, parsedAmount, description || '', date, email, name || '']
        );
        
        res.send({
            acknowledged: true,
            insertedId: result.rows[0].id.toString()
        });
    } catch (error) {
        console.error("Error in POST /add-Transaction:", error);
        res.status(500).send({ error: "Database error", message: error.message });
    }
});

app.put('/transactions/update/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send({ error: "Validation error", message: "Invalid transaction ID" });
    }

    const { type, category, amount, description, date } = req.body;
    const parsedAmount = parseFloat(amount);
    if (!type || !category || isNaN(parsedAmount) || !date) {
        return res.status(400).send({ error: "Validation error", message: "Missing or invalid required fields" });
    }

    try {
        const result = await queryDb(
            `UPDATE transactions 
             SET type = $1, category = $2, amount = $3, description = $4, date = $5 
             WHERE id = $6`,
            [type, category, parsedAmount, description || '', date, id]
        );
        
        res.send({
            acknowledged: true,
            modifiedCount: result.rowCount
        });
    } catch (error) {
        console.error("Error in PUT /transactions/update/:id:", error);
        res.status(500).send({ error: "Database error", message: error.message });
    }
});

app.delete('/transaction/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send({ error: "Validation error", message: "Invalid transaction ID" });
    }

    try {
        const result = await queryDb('DELETE FROM transactions WHERE id = $1', [id]);
        res.send({
            acknowledged: true,
            deletedCount: result.rowCount
        });
    } catch (error) {
        console.error("Error in DELETE /transaction/delete/:id:", error);
        res.status(500).send({ error: "Database error", message: error.message });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app is listening now on port ${port}`);
    });
}

module.exports = app;
