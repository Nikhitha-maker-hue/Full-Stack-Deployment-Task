# TaskFlow — React Frontend

Responsive React frontend for the WA-2 Task Management REST API.

## Tech stack

- React
- Vite
- React Router
- Fetch API
- React Context + useState/useEffect
- CSS responsive layout

## Requirements covered

- 3+ React Router pages
- Real data from the WA-2 REST API
- JWT login/register flow
- Protected routes
- Task list, detail, create and edit pages
- Client-side form validation
- Visible loading states
- Visible API/network error states with retry
- Responsive mobile and desktop layout
- No hardcoded task mock arrays
- README setup instructions

## Routes

- `/login` — login
- `/register` — registration
- `/tasks` — task list
- `/tasks/new` — create task
- `/tasks/:id` — task details
- `/tasks/:id/edit` — edit task

## Run locally

### 1. Start the WA-2 backend

From the WA-2 `Task-API` directory:

```bash
npm install
npm run dev
```

Backend should run at:

```text
http://localhost:5000
```

### 2. Start this frontend

From this project directory:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to `http://localhost:5000`, so no frontend CORS configuration is required for local development.

## Authentication

The frontend stores the JWT returned by `/api/auth/login` in `localStorage` and automatically sends:

```text
Authorization: Bearer <token>
```

with protected API requests.

The token is removed when the user logs out.

## API configuration

For local development, the API target is configured in `vite.config.js`:

```js
proxy: {
  "/api": {
    target: "http://localhost:5000",
    changeOrigin: true
  }
}
```

If your backend runs on another port, change the target.

## Build check

Before submitting to GitHub:

```bash
npm run build
```

A successful build creates the `dist/` directory.

## Testing the error state

Start the frontend, then stop the WA-2 backend and open `/tasks`. The UI should show a visible connection/API error rather than a blank page.

## GitHub submission

Create a public GitHub repository for this frontend and push the project files. Do not commit `node_modules` or secret files.

Typical commands:

```bash
git init
git add .
git commit -m "Build React task management frontend"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
