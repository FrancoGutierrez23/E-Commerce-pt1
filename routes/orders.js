const express = require('express');
const router = express.Router();
const authenticateToken = require('./helpers.js');
const orderController = require('../controllers/orderController.js');

// Get all orders for a user
router.get('/:userId', authenticateToken, orderController.getOrders);

// Make an order of a single product
router.post('/:userId', orderController.createOrder);

// Alter quantity of order item
router.put('/', orderController.updateOrderItem);

// Remove order
router.delete('/', orderController.removeOrder);

module.exports = router;
