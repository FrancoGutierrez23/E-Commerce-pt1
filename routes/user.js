const express = require('express');
const router = express.Router();
const authenticateToken = require('./helpers.js');
const userController = require('../controllers/userController.js');

// Route to get a user by ID
router.get('/:userId', authenticateToken, userController.getUserById);

// Route to update a user
router.put('/:userId', userController.updateUser);

module.exports = router;
