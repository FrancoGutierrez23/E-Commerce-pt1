const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authenticateToken = require('./helpers.js');
const passport = require('./config/passport.js');
const { body, validationResult } = require('express-validator');

// Helper middleware to check for validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

// Registration route
router.post('/register',
    [
        body('username')
          .trim()
          .notEmpty()
          .withMessage('Username is required')
          .matches(/^[A-Za-z0-9]+$/)
      .withMessage('Username can only contain letters and numbers')
      .custom(value => {
        // If the username consists of only numbers, reject it.
        if (/^\d+$/.test(value)) {
          throw new Error('Username cannot be only numbers');
        }
        return true;
      }),
        body('email')
          .isEmail()
          .withMessage('A valid email is required')
          .normalizeEmail(),
        body('password')
          .notEmpty()
          .withMessage('Password is required')
          .isLength({ min: 6 })
          .withMessage('Password must be at least 6 characters long')
      ],
      validateRequest,
    authController.register);

// Login route
router.post('/login',
    [
        body('username')
          .trim()
          .notEmpty()
          .withMessage('Username is required'),
        body('password')
          .notEmpty()
          .withMessage('Password is required')
      ],
      validateRequest,
    authController.login);

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

// Status route to verify if user is logged
router.get('/status', authenticateToken, authController.getStatus);

  

module.exports = router;
