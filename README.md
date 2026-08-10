# FinEase — Smart Financial Tracking

FinEase is a premium personal finance tracking application designed to help users monitor cashflow, log transactions, and review analytics on category spending.

The application features:
*   **Database**: PostgreSQL integration (using a connection pool and auto-migration).
*   **Authentication**: Firebase Authentication.
*   **Aesthetics**: Glassmorphism cards, soft dark theme layouts, and responsive modern dashboard designs.
*   **Analytics**: Donut charts, custom category legends, monthly trend comparisons, and transaction details logs.

---

## Project Structure

This project is structured as a monorepo containing:
1.  **[fine-ease-client/](file:///Users/apple/Developer/FinEase/fine-ease-client)**: React/Vite frontend application styled with TailwindCSS, shadcn, and Recharts.
2.  **[fine-ease-server/](file:///Users/apple/Developer/FinEase/fine-ease-server)**: Node.js Express server connecting to PostgreSQL.

---

## Local Development Setup

### 1. Requirements
Ensure you have Node.js and a local PostgreSQL instance running.

### 2. Configuration
*   Create a `.env` file in **`fine-ease-server/`**:
    ```env
    DATABASE_URL=postgresql://localhost/finease
    PORT=3000
    ```
*   Create a `.env` file in **`fine-ease-client/`**:
    ```env
    VITE_API_URL=http://localhost:3000
    VITE_API_KEY=your_firebase_api_key
    VITE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_PROJECT_ID=your_firebase_project_id
    VITE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_APP_ID=your_firebase_app_id
    ```

### 3. Execution
In the root directory of the project, run:
```bash
# Install dependencies for both frontend and backend
npm run install-all

# Run both frontend and backend concurrently in development mode
npm run dev
```

---

## Pushing to GitHub

Run these commands to commit the restructured workspace and upload it to GitHub:

```bash
# 1. Stage all changes
git add .

# 2. Commit the modifications
git commit -m "feat: migrate database to PostgreSQL, polish UI layouts, and redesign card/modal aesthetics"

# 3. Push to GitHub
git push origin main
```

---

## Deployment Guide

### 1. PostgreSQL Database Setup
Set up a hosted PostgreSQL database on [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Render](https://render.com/). Retrieve your database connection string:
```text
postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require
```

### 2. Backend (fine-ease-server)
*   **Vercel Deployment**:
    *   Deploy the `fine-ease-server/` directory to Vercel. It is configured out-of-the-box using the serverless [vercel.json](file:///Users/apple/Developer/FinEase/fine-ease-server/vercel.json) file.
    *   In the Vercel dashboard, add the environment variable `DATABASE_URL` pointing to your hosted database.
*   **Render Deployment**:
    *   Create a new Web Service on Render, linking your GitHub repository.
    *   Set the **Root Directory** to `fine-ease-server`.
    *   Set the **Build Command** to `npm install`.
    *   Set the **Start Command** to `node index.js`.
    *   In the environment settings, add `DATABASE_URL`.

### 3. Frontend (fine-ease-client)
*   Deploy the `fine-ease-client/` directory to Vercel or Netlify.
*   The project contains routing configurations (`vercel.json` and `_redirects`) to guarantee Single Page Application (SPA) routes reload correctly without 404 errors.
*   Configure the environment variables in your deployment dashboard:
    *   Set `VITE_API_URL` to your deployed backend address (e.g. `https://fine-ease-server.vercel.app` or `https://finease-api.onrender.com`).
    *   Add your Firebase API keys and secrets (`VITE_API_KEY`, `VITE_AUTH_DOMAIN`, etc.).
