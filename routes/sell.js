const express = require('express');
const router = express.Router();
const productController = require('../controllers/sellController.js');
const authenticateToken = require('./helpers.js');

// Apply middleware to all routes in this file
router.use(authenticateToken);

// Route to create a new product
router.post('/', productController.createProduct);

// Route to update an existing product
router.put('/', productController.updateProduct);

// Route to delete a product
router.delete('/', productController.deleteProduct);

module.exports = router;
