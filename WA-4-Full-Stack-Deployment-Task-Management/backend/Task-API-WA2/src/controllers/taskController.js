const { pool } = require("../config/database");

const taskColumns = `
    id, user_id, title, description, completed, created_at, updated_at
`;

const createTask = async (req, res) => {
    try {
        const { title, description, completed = false } = req.body;
        if (!title) return res.status(400).json({ message: "Task title is required" });

        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, completed)
             VALUES ($1, $2, $3, $4)
             RETURNING ${taskColumns}`,
            [req.user.userId, title.trim(), description?.trim() || null, Boolean(completed)]
        );

        return res.status(201).json({ message: "Task created successfully", task: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTasks = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ${taskColumns} FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
            [req.user.userId]
        );
        return res.status(200).json({ message: "Tasks fetched successfully", tasks: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTaskById = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ${taskColumns} FROM tasks WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.user.userId]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: "Task not found" });
        return res.status(200).json({ message: "Task fetched successfully", task: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        if (!title) return res.status(400).json({ message: "Task title is required" });

        const result = await pool.query(
            `UPDATE tasks
             SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5
             RETURNING ${taskColumns}`,
            [title.trim(), description?.trim() || null, Boolean(completed), req.params.id, req.user.userId]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: "Task not found" });
        return res.status(200).json({ message: "Task updated successfully", task: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
            [req.params.id, req.user.userId]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: "Task not found" });
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
