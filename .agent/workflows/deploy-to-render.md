---
description: Comprehensive steps to deploy the Doctor Portal (Frontend & Backend) to Render, including Managed PostgreSQL.
---

# 🚀 Detailed Deployment Guide for Render

This guide provides step-by-step instructions to get your Doctor Portal (including MongoDB and PostgreSQL) live on [Render](https://render.com/).

## 1. Prerequisites
*   **GitHub Repo**: Ensure your project is pushed to GitHub.
*   **MongoDB Atlas**: Have your connection string ready (e.g., `mongodb+srv://...`).

---

## 2. Deploy PostgreSQL (Managed Service) 🐘
Render treats PostgreSQL as a separate managed service. You cannot simply "install" it inside your Web Service.

1.  **Create Database**: Click **New +** > **PostgreSQL**.
2.  **Configure**:
    *   **Name**: `doctor-portal-db`
    *   **Database Name**: `db_icd_codes`
    *   **User**: `postgres`
    *   **Region**: Same as your Web Service (e.g., Oregon/Frankfurt).
3.  **Create**: Click **Create Database**.
4.  **Wait for URL**: Once created, go to the **Info** or **Connect** section.
    *   **Internal Database URL**: Use this for your Backend Web Service.
    *   **External Database URL**: Use this only for local database management (like DBeaver or `psql`).

### ⚠️ Importing the ICD-10 Data
The Render database starts empty. You must import your clinical data:
1.  **Expose External Access**: Ensure your local IP is allowed in the **Access Control** settings of the Render DB.
2.  **Import Command (Local Terminal)**:
    ```bash
    psql "PASTE_YOUR_EXTERNAL_DATABASE_URL" -f path/to/your/icd_dump.sql
    ```
    *(If you only have a CSV, you'll need to use the `\copy` command in `psql`).*

---

## 3. Deploy the Backend (Web Service) 🛠️
1.  **New Resource**: Click **New +** > **Web Service**.
2.  **Connect Repo**: Select your repository.
3.  **Config**:
    *   **Name**: `doctor-portal-api`
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB Atlas string.
    *   `DATABASE_URL`: **Paste the Internal Database URL** from Step 2.
    *   `FRONTEND_URL`: Paste your **Frontend Static Site URL** (e.g., `https://doctor-portal-web.onrender.com`).
    *   `NODE_ENV`: `production`

---

## 4. Deploy the Frontend (Static Site) 🌐
1.  **New Resource**: Click **New +** > **Static Site**.
2.  **Connect Repo**: Same repository.
3.  **Config**:
    *   **Name**: `doctor-portal-web`
    *   **Root Directory**: `.`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
4.  **Environment Variables**:
    *   `VITE_API_URL`: Paste the URL of your Backend Service (e.g., `https://doctor-portal-api.onrender.com/api`).
5.  **Redirects/Rewrites**:
    *   Click **Redirects/Rewrites** in the sidebar.
    *   Add Rule: `/*` -> `/index.html` (Action: **Rewrite**).

---

## 5. Why "Like That"? (PostgreSQL Context) 🔍
*   **Infrastructure as Code**: Render separates the DB from the Application layer for scalability and security.
*   **SSL enforced**: Render PostgreSQL requires SSL. The code in `pgConfig.js` is already configured to handle this when `DATABASE_URL` is present.
*   **Persistence**: Data inside a Web Service is ephemeral (wiped on restart). Using the separate PostgreSQL service ensures your patient records and ICD data persist.
*   **Import Requirement**: A managed DB is an empty engine; the clinical "fuel" (ICD data) must be manually piped in after creation.
