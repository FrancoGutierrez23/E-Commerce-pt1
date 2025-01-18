const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/index.js');
const router = express.Router();
const authenticateToken = require('./helpers.js');

// Registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const result = await db.query(
            `INSERT INTO users (username, email, password) 
             VALUES ($1, $2, $3) 
             RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            user: result.rows[0],
        });
    } catch (error) {
        if (error.code === '23505') {
            // Handle unique constraint violations
            res.status(400).json({ error: 'Username or email already exists.' });
        } else {
            res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        // Fetch user from DB
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).send('Invalid credentials.');
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials.');
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({ message: 'Login successful!', token });
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
});


router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Profile accessed successfully!',
        user: req.user,
    });
});


module.exports = {router, authenticateToken};
