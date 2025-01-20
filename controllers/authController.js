const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel.js');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await authModel.createUser(username, email, hashedPassword);

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Username or email already exists.' });
        } else {
            res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
};


const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' }); // Changed to .json
    }

    try {
        const result = await authModel.getUserByUsername(username);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid username.' }); // Changed to .json
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password.' }); // Changed to .json
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '10h' });

        res.status(200).json({
            message: 'Login successful!',
            user: { id: user.id, username: user.username },
            token, // JWT token for authentication
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error.' }); // Changed to .json
    }
};


const getProfile = (req, res) => {
    res.status(200).json({
        message: 'Profile accessed successfully!',
        user: req.user,
    });
};

module.exports = {
    register,
    login,
    getProfile
};
