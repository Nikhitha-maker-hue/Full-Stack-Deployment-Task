const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        if (!name || !normalizedEmail || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rowCount > 0) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name.trim(), normalizedEmail, hashedPassword]
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [normalizedEmail]
        );
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login };
