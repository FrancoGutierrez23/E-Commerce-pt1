const express = require('express');
const router = express.Router();
exports.router = router;
const authenticateToken = require('./helpers.js');
const cartController = require('../controllers/cartController.js');

// Get cart for a user
router.get('/:id',authenticateToken ,cartController.getCart);

// Add an item to a cart
router.post('/', cartController.addToCart);

// Alter quantity of an item in the cart
router.put('/', cartController.updateQuantity);

// Remove an item from the cart
router.delete('/', cartController.deleteItem);

// Checkout
router.post('/:cartId/checkout', cartController.checkout);

module.exports = router;
