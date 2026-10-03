const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const {
    body,
    validationResult
} = require("express-validator");

const router = express.Router();


// ===============================
// REGISTER VALIDATION
// ===============================
const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];


// ===============================
// LOGIN VALIDATION
// ===============================
const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];


// ===============================
// ROUTES
// ===============================

router.post(
    "/register",
    registerValidation,
    register
);

router.post(
    "/login",
    loginValidation,
    login
);


// ===============================
// PROTECTED TEST ROUTE
// ===============================

router.get(
    "/protected",
    authMiddleware,
    (req, res) => {
        res.status(200).json({
            message: "You accessed a protected route",
            user: req.user
        });
    }
);

module.exports = router;