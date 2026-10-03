const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check whether token exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information
        req.user = decoded;

        // Continue to next middleware/controller
        next();

    } catch (error) {
        console.error(error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;