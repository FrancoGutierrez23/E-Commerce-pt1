const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel.js');
const JWT_SECRET = process.env.JWT_SECRET;

// Register (POST) controller
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash password and store new user
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


        if (error.code === '23505') res.status(400).json({ error: 'Username or email already exists.' });

        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};


// Login (POST) controller
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await authModel.getUserByUsername(username);

        const user = result.rows[0];
        if (!user) return res.status(400).json({ error: 'Invalid username.' })

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password.' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful!',
            user: { id: user.id, username: user.username },
            token, // JWT token for authentication
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

// Google login (GET) controller
const googleLogin = async (req, res) => {
    try {
        const user = req.user; // User authenticated via Google
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const redirect_base_uri = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Redirect to the frontend with the token as a query parameter
        res.redirect(`${redirect_base_uri}/user/${user.id}?token=${token}`);

    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
}

// Logout (GET) controller
const logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed.' });

      req.session.destroy((destroyErr) => {
        if (destroyErr) return res.status(500).json({ error: 'Failed to destroy session.' });

        res.clearCookie('connect.sid', {
            path: '/login',
        })

        res.status(200).json({ message: 'Logout successful!' });
      });
    });
  };
  
// User status (GET) controller 
const getStatus = (req, res) => {
    res.json({
        isAuthenticated: true,
        user: {
            id: req.user.userId || req.user.id,
        },
    });
}

module.exports = {
    register,
    login, 
    googleLogin,
    logout,
    getStatus
};
