# Task Management REST API

A backend REST API for managing tasks with user authentication and authorization.

This project was built using **Node.js, Express.js, and SQLite**. It provides secure user registration and login using hashed passwords and JWT authentication. Authenticated users can create, read, update, and delete their own tasks.

---

## Features

* User registration
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Protected API routes
* Create tasks
* Get all tasks
* Get a single task
* Update tasks
* Delete tasks
* User-specific task ownership
* Request validation using express-validator
* SQLite database
* Proper HTTP status codes
* Centralized 404 handling
* Global error handling

---

## Tech Stack

* **Node.js**
* **Express.js**
* **SQLite**
* **better-sqlite3**
* **bcryptjs**
* **JSON Web Token (JWT)**
* **express-validator**
* **dotenv**
* **Postman**
* **Git & GitHub**

---

## Project Structure

```text
task-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd task-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

> Do not share your actual `JWT_SECRET` publicly.

### 5. Start the development server

```bash
npm run dev
```

The server will run at:

```text
http://localhost:5000
```

---

## Environment Variables

The application uses the following environment variables:

| Variable     | Description                                   |
| ------------ | --------------------------------------------- |
| `PORT`       | Port on which the server runs                 |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

Example:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

---

## API Base URL

```text
http://localhost:5000
```

---

# Authentication API

## Register User

Creates a new user account.

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
    "name": "Nikhitha",
    "email": "nikhitha@example.com",
    "password": "password123"
}
```

### Successful Response

**Status: `201 Created`**

```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "Nikhitha",
        "email": "nikhitha@example.com"
    }
}
```

The password is never returned in the response.

---

## Login User

Authenticates an existing user and returns a JWT token.

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
    "email": "nikhitha@example.com",
    "password": "password123"
}
```

### Successful Response

**Status: `200 OK`**

```json
{
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
        "id": 1,
        "name": "Nikhitha",
        "email": "nikhitha@example.com"
    }
}
```

The returned JWT token must be used to access protected endpoints.

---

## Protected Authentication Test

Tests whether the supplied JWT token is valid.

### Endpoint

```http
GET /api/auth/protected
```

### Authorization

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Successful Response

**Status: `200 OK`**

```json
{
    "message": "You accessed a protected route",
    "user": {
        "userId": 1,
        "email": "nikhitha@example.com"
    }
}
```

---

# Task API

All task endpoints require JWT authentication.

Add the following header to protected requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Create Task

Creates a new task for the authenticated user.

### Endpoint

```http
POST /api/tasks
```

### Request Body

```json
{
    "title": "Learn Node.js",
    "description": "Complete REST API internship assignment",
    "completed": false
}
```

### Successful Response

**Status: `201 Created`**

```json
{
    "message": "Task created successfully",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Learn Node.js",
        "description": "Complete REST API internship assignment",
        "completed": 0,
        "created_at": "2026-09-28 12:00:00",
        "updated_at": "2026-09-28 12:00:00"
    }
}
```

---

## Get All Tasks

Returns all tasks belonging to the authenticated user.

### Endpoint

```http
GET /api/tasks
```

### Successful Response

**Status: `200 OK`**

```json
{
    "message": "Tasks fetched successfully",
    "tasks": [
        {
            "id": 1,
            "user_id": 1,
            "title": "Learn Node.js",
            "description": "Complete REST API internship assignment",
            "completed": 0,
            "created_at": "2026-09-28 12:00:00",
            "updated_at": "2026-09-28 12:00:00"
        }
    ]
}
```

---

## Get Single Task

Returns a specific task belonging to the authenticated user.

### Endpoint

```http
GET /api/tasks/:id
```

### Example

```http
GET /api/tasks/1
```

### Successful Response

**Status: `200 OK`**

```json
{
    "message": "Task fetched successfully",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Learn Node.js",
        "description": "Complete REST API internship assignment",
        "completed": 0,
        "created_at": "2026-09-28 12:00:00",
        "updated_at": "2026-09-28 12:00:00"
    }
}
```

---

## Update Task

Updates an existing task belonging to the authenticated user.

### Endpoint

```http
PUT /api/tasks/:id
```

### Example

```http
PUT /api/tasks/1
```

### Request Body

```json
{
    "title": "Learn Node.js and Express",
    "description": "Complete CRUD API and authentication",
    "completed": true
}
```

### Successful Response

**Status: `200 OK`**

```json
{
    "message": "Task updated successfully",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Learn Node.js and Express",
        "description": "Complete CRUD API and authentication",
        "completed": 1,
        "created_at": "2026-09-28 12:00:00",
        "updated_at": "2026-09-28 12:30:00"
    }
}
```

---

## Delete Task

Deletes a task belonging to the authenticated user.

### Endpoint

```http
DELETE /api/tasks/:id
```

### Example

```http
DELETE /api/tasks/1
```

### Successful Response

**Status: `200 OK`**

```json
{
    "message": "Task deleted successfully"
}
```

---

# Authentication

Protected endpoints require a valid JWT token.

After logging in, copy the token from the response and include it in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The JWT token is currently configured to expire after **1 hour**.

---

# Validation

The API validates incoming requests using `express-validator`.

Examples of validation include:

* Name is required during registration
* Email must be a valid email address
* Password must be at least 6 characters
* Task title is required
* Task ID must be a valid positive number
* `completed` must contain a valid boolean value

Invalid requests return:

```text
400 Bad Request
```

Example:

```json
{
    "errors": [
        {
            "type": "field",
            "value": "wrong-email",
            "msg": "Please provide a valid email",
            "path": "email",
            "location": "body"
        }
    ]
}
```

---

# HTTP Status Codes

| Status Code | Meaning                             |
| ----------- | ----------------------------------- |
| `200`       | Request successful                  |
| `201`       | Resource created successfully       |
| `400`       | Invalid request or validation error |
| `401`       | Authentication required or invalid  |
| `404`       | Resource or route not found         |
| `500`       | Internal server error               |

---

# Database

This project uses **SQLite** with `better-sqlite3`.

The database is automatically created when the application starts.

## Users Table

| Column       | Type     | Description           |
| ------------ | -------- | --------------------- |
| `id`         | INTEGER  | Primary key           |
| `name`       | TEXT     | User name             |
| `email`      | TEXT     | Unique user email     |
| `password`   | TEXT     | Hashed password       |
| `created_at` | DATETIME | Account creation time |

## Tasks Table

| Column        | Type     | Description            |
| ------------- | -------- | ---------------------- |
| `id`          | INTEGER  | Primary key            |
| `user_id`     | INTEGER  | ID of task owner       |
| `title`       | TEXT     | Task title             |
| `description` | TEXT     | Task description       |
| `completed`   | INTEGER  | Task completion status |
| `created_at`  | DATETIME | Task creation time     |
| `updated_at`  | DATETIME | Last update time       |

The `user_id` column creates a relationship between users and their tasks.

Tasks are deleted automatically when their associated user is deleted.

---

# Security

The API includes several security-related features:

* Passwords are never stored as plain text.
* Passwords are hashed using `bcryptjs`.
* JWT tokens are used for authentication.
* Protected routes require a valid JWT.
* JWT tokens have an expiration time.
* Users can only access their own tasks.
* Input validation is implemented using `express-validator`.
* `.env` is excluded from Git.
* The SQLite database file is excluded from Git.

---

# User Task Ownership

Each task belongs to a specific user through the `user_id` field.

For example:

```text
User 1
 ├── Task 1
 ├── Task 2
 └── Task 3

User 2
 ├── Task 4
 └── Task 5
```

When retrieving, updating, or deleting a task, the API checks both:

```text
task ID
+
authenticated user's ID
```

This prevents one authenticated user from accessing another user's tasks.

---

# Error Handling

The API provides centralized handling for unknown routes and unexpected server errors.

## Unknown Route

Example:

```http
GET /api/unknown
```

Response:

**Status: `404 Not Found`**

```json
{
    "message": "Route not found"
}
```

## Server Error

Unexpected server errors return:

**Status: `500 Internal Server Error`**

```json
{
    "message": "Internal server error"
}
```

---

# Testing

The API was tested using **Postman**.

The following functionality was tested:

* User registration
* Registration validation
* Duplicate email validation
* User login
* Invalid login
* JWT authentication
* Protected routes
* Missing authentication token
* Create task
* Create task validation
* Get all tasks
* Get single task
* Invalid task ID
* Update task
* Update validation
* Delete task
* Deleted task verification
* Missing task handling
* Unknown route handling
* User task ownership

---

# API Endpoint Summary

| Method   | Endpoint              | Authentication | Description          |
| -------- | --------------------- | -------------- | -------------------- |
| `POST`   | `/api/auth/register`  | No             | Register user        |
| `POST`   | `/api/auth/login`     | No             | Login user           |
| `GET`    | `/api/auth/protected` | Yes            | Test authentication  |
| `POST`   | `/api/tasks`          | Yes            | Create task          |
| `GET`    | `/api/tasks`          | Yes            | Get all user's tasks |
| `GET`    | `/api/tasks/:id`      | Yes            | Get single task      |
| `PUT`    | `/api/tasks/:id`      | Yes            | Update task          |
| `DELETE` | `/api/tasks/:id`      | Yes            | Delete task          |

---

# Available Scripts

## Start the server

```bash
npm start
```

## Start development server

```bash
npm run dev
```

The development command uses **nodemon** to automatically restart the server when code changes.

---

# Example API Workflow

A typical workflow for using the API is:

```text
1. Register
      ↓
2. Login
      ↓
3. Receive JWT token
      ↓
4. Send JWT with protected requests
      ↓
5. Create task
      ↓
6. Get tasks
      ↓
7. Update task
      ↓
8. Delete task
```

---

# Project Status

```text
Completed
```

The API includes authentication, authorization, validation, complete task CRUD operations, SQLite persistence, error handling, and Postman testing.

---

# Author

**Nikhitha**

---

## License

This project was created for educational and internship purposes.
