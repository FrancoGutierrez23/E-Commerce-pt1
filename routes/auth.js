const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authenticateToken = require('./helpers.js');

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Profile route
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
