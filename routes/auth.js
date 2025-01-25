const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authenticateToken = require('./helpers.js');
const passport = require('./config/passport.js');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
  };
  

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
router.get('/logout', authController.logout);

// auth.js (routes)
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
      res.json({
          isAuthenticated: true,
          user: {
              id: req.user.id,
              username: req.user.username,
              email: req.user.email,
          },
      });
  } else {
      res.json({ isAuthenticated: false });
  }
});

  

module.exports = router;
