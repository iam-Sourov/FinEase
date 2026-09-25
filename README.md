# FinEase — Smart Financial Tracking

FinEase is a premium personal finance tracking application designed to help users monitor cashflow, log transactions, and review analytics on category spending.

The application features:
*   **Database**: PostgreSQL integration on Supabase (using connection pool and auto-migration).
*   **Authentication**: Supabase Authentication.
*   **Aesthetics**: Glassmorphism cards, soft dark theme layouts, and responsive modern dashboard designs.
*   **Analytics**: Donut charts, custom category legends, monthly trend comparisons, and transaction details logs.

---

## Project Structure

This project is structured as a monorepo containing:
1.  **[fine-ease-client/](file:///Users/apple/Developer/FinEase/fine-ease-client)**: React/Vite frontend application styled with TailwindCSS, shadcn, and Recharts.
2.  **[fine-ease-server/](file:///Users/apple/Developer/FinEase/fine-ease-server)**: Node.js Express server connecting to PostgreSQL / Supabase.

---

## Local Development Setup

### 1. Requirements
Ensure you have Node.js and a PostgreSQL instance running (or Supabase connection string).

### 2. Configuration
*   Create a `.env` file in **`fine-ease-server/`**:
    ```env
    DATABASE_URL=postgresql://postgres.kqwmywrdtfyxrqgisrqw:9J1JASCz3De1U3iE@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
    PORT=3000
    ```
*   Create a `.env` file in **`fine-ease-client/`**:
    ```env
    VITE_API_URL=http://localhost:3000
    VITE_SUPABASE_URL=https://kqwmywrdtfyxrqgisrqw.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ```

---

## Deployment Guide (Vercel)

### 1. Backend Deployment (`fine-ease-server`)
*   Deploy the `fine-ease-server/` directory to Vercel. It is configured using the serverless `vercel.json` file.
*   In the Vercel dashboard, set the **Root Directory** to `fine-ease-server`.
*   Add the environment variable `DATABASE_URL` pointing to your hosted database.

### 2. Frontend Deployment (`fine-ease-client`)
*   Deploy the `fine-ease-client/` directory to Vercel.
*   In the Vercel dashboard, set the **Root Directory** to `fine-ease-client`.
*   Configure the environment variable `VITE_API_URL` pointing to your deployed Vercel backend server URL.
