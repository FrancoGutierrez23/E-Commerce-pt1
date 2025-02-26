const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate token or Passport session
const authenticateToken = (req, res, next) => {
    // Check if user is authenticated via Passport (sessions)
    if (req.isAuthenticated()) return next();
    // If no session, check JWT token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required.' });

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user; // Attach user info to request object
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;
