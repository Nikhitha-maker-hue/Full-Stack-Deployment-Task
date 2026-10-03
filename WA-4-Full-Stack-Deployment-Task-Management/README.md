# WA-4 Full-Stack Deployment – Task Management App

This project is the WA-2 backend + WA-3 React frontend prepared for WA-4 deployment.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT + bcryptjs
- Frontend hosting: Vercel
- Backend/database hosting: Render

## Folder structure

```text
WA-4-Full-Stack-Deployment/
├── backend/Task-API-WA2/
├── frontend/Task-Frontend-WA3/Task-Frontend/
├── render.yaml
└── README.md
```

## 1. Backend local setup

```bash
cd backend/Task-API-WA2
npm install
```

Copy `.env.example` to `.env` and fill in a PostgreSQL connection string and a strong JWT secret.

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

Health check:

```text
GET http://localhost:5000/health
```

## 2. Frontend local setup

```bash
cd frontend/Task-Frontend-WA3/Task-Frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then:

```bash
npm run dev
```

## 3. Deploy backend + PostgreSQL on Render

1. Push this project to GitHub. You can use a monorepo or separate repositories.
2. On Render, create a PostgreSQL database.
3. Create a Node Web Service for `backend/Task-API-WA2`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=<strong random secret>`
   - `DATABASE_URL=<Render PostgreSQL connection string>`
   - `FRONTEND_URL=<your Vercel URL>`
7. Deploy and test `/health`.

`render.yaml` is included as a reference for a Render Blueprint deployment. Review the plan options shown in your Render account before applying it.

## 4. Deploy frontend on Vercel

1. Import the frontend repository/folder into Vercel.
2. Framework: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com/api
```

6. Deploy.
7. Copy the Vercel URL into the Render `FRONTEND_URL` environment variable and redeploy the backend.

## 5. WA-4 end-to-end test

Use the public Vercel URL and verify:

- Register a new account
- Log in
- Create a task
- Read/view the task
- Update the task
- Delete the task
- Refresh the browser and verify the deployed app still works

## Security checklist

Do not commit:

- `.env`
- database passwords
- JWT secrets
- PostgreSQL connection strings
- `node_modules`
- SQLite database files

Only `.env.example` files should be committed.
