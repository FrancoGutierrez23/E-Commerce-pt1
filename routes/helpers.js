const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log(req);
        return res.status(401).json({ error: 'Access token required.' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        console.log(user);
        req.user = user; // Attach user info to request object
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;