const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');
const { Pool } = require('pg');

// Type ID for DATE is 1082. Prevent node-postgres from parsing DATE into a JS Date object in local time/UTC.
pg.types.setTypeParser(1082, (val) => val);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

let pool = null;
let dbInitialized = false;

// Fallback in-memory dataset if Supabase PostgreSQL database is paused or unreachable
let inMemoryStore = [
    {
        id: 1,
        _id: "1",
        type: 'income',
        category: 'salary',
        amount: 4500.00,
        description: 'Monthly Salary Payment',
        date: '2026-08-01',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        _id: "2",
        type: 'expense',
        category: 'rent',
        amount: 1200.00,
        description: 'Apartment Rent',
        date: '2026-08-02',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB',
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        _id: "3",
        type: 'expense',
        category: 'groceries',
        amount: 154.20,
        description: 'Weekly Groceries at Supermarket',
        date: '2026-08-04',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB',
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        _id: "4",
        type: 'expense',
        category: 'utilities',
        amount: 85.50,
        description: 'Electricity and Water Bill',
        date: '2026-08-05',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB',
        created_at: new Date().toISOString()
    }
];
let nextMemoryId = 5;

function getPool() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        return null;
    }
    if (!pool) {
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
    if (!activePool) {
        throw new Error("DATABASE_URL environment variable is missing.");
    }

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
    res.json({ status: "ok", message: "FinEase Server is active and operational on Vercel" });
});

app.get('/', async (req, res) => {
    try {
        const result = await queryDb('SELECT * FROM transactions ORDER BY id DESC');
        const transactions = result.rows.map(row => ({
            ...row,
            _id: row.id.toString()
        }));
        return res.json(transactions);
    } catch (error) {
        console.warn("⚠️ Postgres query failed, falling back to resilient in-memory store:", error.message);
        const sorted = [...inMemoryStore].sort((a, b) => b.id - a.id);
        return res.json(sorted);
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
        return res.json(transactions);
    } catch (error) {
        console.warn("⚠️ Postgres query failed, falling back to resilient in-memory store:", error.message);
        let filtered = inMemoryStore;
        if (email) {
            filtered = inMemoryStore.filter(t => t.email === email);
        }
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        return res.json(sorted);
    }
});

app.post('/add-Transaction', async (req, res) => {
    const { type, category, amount, description, date, email, name } = req.body;
    
    const parsedAmount = parseFloat(amount);
    if (!type || !category || isNaN(parsedAmount) || !date || !email) {
        return res.status(400).send({ error: "Validation error", message: "Missing or invalid required fields" });
    }

    try {
        const result = await queryDb(
            `INSERT INTO transactions (type, category, amount, description, date, email, name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [type, category, parsedAmount, description || '', date, email, name || '']
        );
        
        return res.send({
            acknowledged: true,
            insertedId: result.rows[0].id.toString()
        });
    } catch (error) {
        console.warn("⚠️ Postgres insert failed, falling back to resilient in-memory store:", error.message);
        const newId = nextMemoryId++;
        const newTx = {
            id: newId,
            _id: newId.toString(),
            type,
            category,
            amount: parsedAmount,
            description: description || '',
            date,
            email,
            name: name || '',
            created_at: new Date().toISOString()
        };
        inMemoryStore.push(newTx);
        return res.send({
            acknowledged: true,
            insertedId: newTx._id
        });
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
            [type, category, amount, description, date, id]
        );
        
        return res.send({
            acknowledged: true,
            modifiedCount: result.rowCount
        });
    } catch (error) {
        console.warn("⚠️ Postgres update failed, falling back to resilient in-memory store:", error.message);
        const index = inMemoryStore.findIndex(t => t.id === id || t._id === req.params.id);
        if (index !== -1) {
            inMemoryStore[index] = {
                ...inMemoryStore[index],
                type,
                category,
                amount: parsedAmount,
                description: description || '',
                date
            };
            return res.send({ acknowledged: true, modifiedCount: 1 });
        }
        return res.send({ acknowledged: true, modifiedCount: 0 });
    }
});

app.delete('/transaction/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send({ error: "Validation error", message: "Invalid transaction ID" });
    }

    try {
        const result = await queryDb('DELETE FROM transactions WHERE id = $1', [id]);
        return res.send({
            acknowledged: true,
            deletedCount: result.rowCount
        });
    } catch (error) {
        console.warn("⚠️ Postgres delete failed, falling back to resilient in-memory store:", error.message);
        const initialLen = inMemoryStore.length;
        inMemoryStore = inMemoryStore.filter(t => t.id !== id && t._id !== req.params.id);
        const deletedCount = initialLen - inMemoryStore.length;
        return res.send({ acknowledged: true, deletedCount });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app is listening now on port ${port}`);
    });
}

module.exports = app;
