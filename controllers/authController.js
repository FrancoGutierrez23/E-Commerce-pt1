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
    console.log("Database URL:", process.env.DATABASE_URL);

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const result = await authModel.getUserByUsername(username);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid username.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful!',
            user: { id: user.id, username: user.username },
            token, // JWT token for authentication
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

const googleLogin = async (req, res) => {
    try {
        const user = req.user; // User authenticated via Google
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Redirect to the frontend with the token as a query parameter
        res.redirect(`https://localhost:3000/user/${user.id}?token=${token}`);
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
}

const logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed.' });
      req.session.destroy((destroyErr) => {
        if (destroyErr) return res.status(500).json({ error: 'Failed to destroy session.' });
        res.status(200).json({ message: 'Logout successful!' });
      });
    });
  };
  


module.exports = {
    register,
    login, 
    googleLogin,
    logout
};
