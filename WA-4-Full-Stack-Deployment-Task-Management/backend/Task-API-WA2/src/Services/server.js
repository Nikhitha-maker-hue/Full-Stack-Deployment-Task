require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool, initDatabase } = require("../config/database");
const authRoutes = require("../routes/authRoutes");
const taskRoutes = require("../routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
    origin: allowedOrigin ? allowedOrigin.split(",").map((origin) => origin.trim()) : true
}));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Task API is running!" }));
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "ok", database: "connected" });
    } catch (error) {
        res.status(503).json({ status: "error", database: "unavailable" });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

initDatabase()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
