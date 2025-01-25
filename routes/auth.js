const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authenticateToken = require('./helpers.js');
const passport = require('./config/passport.js');

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    authController.googleLogin
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json('Error logging out.');
        res.redirect('/'); // Redirect to home page
    });
});

module.exports = router;
