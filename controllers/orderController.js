const orderModel = require('../models/orderModel.js');
const db = require('../db/index.js');

// GET all orders for a user
const getOrders = async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await orderModel.getOrdersByUserId(userId);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User has no orders yet' });
        res.status(200).json({ orders: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// POST an order of a single product
const createOrder = async (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity, itemPrice } = req.body;
    const totalPrice = quantity * itemPrice;

    try {
        const orderResult = await orderModel.createOrder(userId, totalPrice);
        const orderId = orderResult.rows[0].id;
        const orderItemResult = await orderModel.createOrderItem(orderId, productId, quantity, itemPrice);
        const orderItemId = orderItemResult.rows[0].id;
        const result = await db.query(`SELECT * FROM order_items WHERE id = $1;`, [orderItemId]);
        res.send(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
        console.log(error);
    }
};

// UPDATE quantity of order item
const updateOrderItem = async (req, res) => {
    const { quantity, productPrice, orderId, orderItemId } = req.body;
    const updatedTotalPrice = quantity * productPrice;

    try {
        await orderModel.updateOrderItemQuantity(quantity, orderItemId);
        await orderModel.updateOrderTotalPrice(updatedTotalPrice, orderId);
        const result = await orderModel.getOrderByOrderItemId(orderItemId);
        res.send(result.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
};

// DELETE order
const removeOrder = async (req, res) => {
    const { orderId } = req.body;
    console.log(req.body);

    if (!orderId) return res.status(400).json({ error: 'Order ID is required for deletion.' });

    try {
        const orderItemsResult = await orderModel.deleteOrderItems(orderId);
        if (orderItemsResult.rows.length === 0) return res.status(404).json({ error: 'Order items not found.' });

        await orderModel.deleteOrder(orderId);
        res.status(200).json({ message: 'Order deleted successfully!' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrderItem,
    removeOrder
};
