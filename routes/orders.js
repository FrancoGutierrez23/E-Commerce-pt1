const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

// Get all orders for a user
router.get('/', orderController.getOrders);

// Make an order of a single product
router.post('/', orderController.createOrder);

// Alter quantity of order item
router.put('/', orderController.updateOrderItem);

// Remove order
router.delete('/', orderController.removeOrder);

module.exports = router;
