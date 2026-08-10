require('dotenv').config();
const { Pool } = require('pg');

// Clean connection string parameter overrides for pg compliance
const cleanUrl = process.env.DATABASE_URL.split('?')[0];

const pool = new Pool({
    connectionString: cleanUrl,
    ssl: cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
});

const exampleTransactions = [
    {
        type: 'income',
        category: 'salary',
        amount: 4500.00,
        description: 'Monthly Salary Payment',
        date: '2026-08-01',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    },
    {
        type: 'expense',
        category: 'rent',
        amount: 1200.00,
        description: 'Apartment Rent',
        date: '2026-08-02',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    },
    {
        type: 'expense',
        category: 'groceries',
        amount: 154.20,
        description: 'Weekly Groceries at Supermarket',
        date: '2026-08-04',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    },
    {
        type: 'expense',
        category: 'utilities',
        amount: 85.50,
        description: 'Electricity and Water Bill',
        date: '2026-08-05',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    },
    {
        type: 'income',
        category: 'commission',
        amount: 350.00,
        description: 'Freelance UI Design Project',
        date: '2026-08-06',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    },
    {
        type: 'expense',
        category: 'food',
        amount: 45.80,
        description: 'Dinner with friends',
        date: '2026-08-08',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    },
    {
        type: 'expense',
        category: 'entertainment',
        amount: 15.00,
        description: 'Netflix Monthly Subscription',
        date: '2026-08-09',
        email: 'silenboyk7@gmail.com',
        name: 'SOUROV AHMED RAKIB'
    }
];

async function seed() {
    console.log('🌱 Starting database seeding on Supabase...');
    
    // Ensure table exists
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

    // Delete existing items to avoid duplicates on fresh seed
    await pool.query('DELETE FROM transactions');

    for (const t of exampleTransactions) {
        await pool.query(
            `INSERT INTO transactions (type, category, amount, description, date, email, name)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [t.type, t.category, t.amount, t.description, t.date, t.email, t.name]
        );
        console.log(`+ Added ${t.type}: $${t.amount} (${t.category})`);
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
