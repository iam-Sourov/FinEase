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
app.use(express.json());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("\n❌ Error: DATABASE_URL environment variable is missing!");
    console.error("Please create a '.env' file inside the 'fine-ease-server' directory and configure:");
    console.error("DATABASE_URL=postgresql://<username>:<password>@<hostname>:<port>/<dbname>?sslmode=require\n");
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
});

async function initDb() {
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
    `;
    await pool.query(createTableQuery);
    console.log("✅ Database initialized and table 'transactions' is ready.");
}

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions');
        const transactions = result.rows.map(row => ({
            ...row,
            _id: row.id.toString()
        }));
        res.send(transactions);
    } catch (error) {
        console.error("Error in GET /:", error);
        res.status(500).send({ error: "Database error" });
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

        queryText += ' ORDER BY amount DESC, date DESC';

        const result = await pool.query(queryText, queryParams);
        const transactions = result.rows.map(row => ({
            ...row,
            _id: row.id.toString()
        }));
        res.send(transactions);
    } catch (error) {
        console.error("Error in GET /my-transactions:", error);
        res.status(500).send({ error: "Database error" });
    }
});

app.post('/add-Transaction', async (req, res) => {
    const { type, category, amount, description, date, email, name } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO transactions (type, category, amount, description, date, email, name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [type, category, amount, description, date, email, name]
        );
        
        res.send({
            acknowledged: true,
            insertedId: result.rows[0].id.toString()
        });
    } catch (error) {
        console.error("Error in POST /add-Transaction:", error);
        res.status(500).send({ error: "Database error" });
    }
});

app.put('/transactions/update/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { type, category, amount, description, date } = req.body;
    try {
        const result = await pool.query(
            `UPDATE transactions 
             SET type = $1, category = $2, amount = $3, description = $4, date = $5 
             WHERE id = $6`,
            [type, category, amount, description, date, id]
        );
        
        res.send({
            acknowledged: true,
            modifiedCount: result.rowCount
        });
    } catch (error) {
        console.error("Error in PUT /transactions/update/:id:", error);
        res.status(500).send({ error: "Database error" });
    }
});

app.delete('/transaction/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
        res.send({
            acknowledged: true,
            deletedCount: result.rowCount
        });
    } catch (error) {
        console.error("Error in DELETE /transaction/delete/:id:", error);
        res.status(500).send({ error: "Database error" });
    }
});

async function startServer() {
    try {
        await initDb();
        app.listen(port, () => {
            console.log(`Example app is listening now on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Failed to initialize database or start server:", error);
        process.exit(1);
    }
}

startServer();
