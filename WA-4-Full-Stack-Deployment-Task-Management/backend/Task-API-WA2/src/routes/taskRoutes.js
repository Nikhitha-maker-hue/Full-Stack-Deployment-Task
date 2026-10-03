const express = require("express");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    body,
    param,
    validationResult
} = require("express-validator");

const router = express.Router();


// ===============================
// VALIDATION HANDLER
// ===============================
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};


// ===============================
// CREATE TASK VALIDATION
// ===============================
const createTaskValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required"),

    body("description")
        .optional()
        .trim(),

    body("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be true or false"),

    handleValidationErrors
];


// ===============================
// UPDATE TASK VALIDATION
// ===============================
const updateTaskValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Task ID must be a valid number"),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required"),

    body("description")
        .optional()
        .trim(),

    body("completed")
        .isBoolean()
        .withMessage("Completed must be true or false"),

    handleValidationErrors
];


// ===============================
// TASK ROUTES
// ===============================

// Create task
router.post(
    "/",
    authMiddleware,
    createTaskValidation,
    createTask
);

// Get all tasks
router.get(
    "/",
    authMiddleware,
    getTasks
);

// Get single task
router.get(
    "/:id",
    authMiddleware,
    param("id")
        .isInt({ min: 1 })
        .withMessage("Task ID must be a valid number"),
    handleValidationErrors,
    getTaskById
);

// Update task
router.put(
    "/:id",
    authMiddleware,
    updateTaskValidation,
    updateTask
);

// Delete task
router.delete(
    "/:id",
    authMiddleware,
    param("id")
        .isInt({ min: 1 })
        .withMessage("Task ID must be a valid number"),
    handleValidationErrors,
    deleteTask
);

module.exports = router;