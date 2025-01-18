const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Route to get all users
router.get('/', userController.getAllUsers);

// Route to get a user by ID
router.get('/:userId', userController.getUserById);

// Route to update a user
router.put('/:userId', userController.updateUser);

module.exports = router;
