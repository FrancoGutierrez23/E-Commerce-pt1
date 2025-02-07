const db = require('../db/index.js');

// GET all orders by user ID
const getOrdersByUserId = async (userId) => {
    return await db.query(
        `SELECT 
            o.id AS order_id,
            o.total_price,
            o.created_at,
            o.status,
            oi.product_id,
            oi.quantity,
            oi.price,
            oi.id AS key
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
};

// GET an order by order item ID
const getOrderByOrderItemId = async (orderItemId) => {
    return await db.query(`SELECT * FROM order_items WHERE id = $1;`, [orderItemId]);
};

// POST new order
const createOrder = async (userId, totalPrice) => {
    return await db.query(
        `INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id;`,
        [userId, totalPrice]
    );
};

// POST order item
const createOrderItem = async (orderId, productId, quantity, price) => {
    return await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4) RETURNING id;`,
        [orderId, productId, quantity, price]
    );
};

// UPDATE quantity of an order item
const updateOrderItemQuantity = async (quantity, orderItemId) => {
    return await db.query('UPDATE order_items SET quantity = $1 WHERE id = $2', [quantity, orderItemId]);
};

// UPDATE total price
const updateOrderTotalPrice = async (updatedTotalPrice, orderId) => {
    return await db.query('UPDATE orders SET total_price = $1 WHERE id = $2', [updatedTotalPrice, orderId]);
};

// DELETE order items
const deleteOrderItems = async (orderId) => {
    return await db.query(
        `DELETE FROM order_items WHERE order_id = $1 RETURNING *;`,
        [orderId]
    );
};

// DELETE order
const deleteOrder = async (orderId) => {
    return await db.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
};

module.exports = {
    getOrdersByUserId,
    getOrderByOrderItemId,
    createOrder,
    createOrderItem,
    updateOrderItemQuantity,
    updateOrderTotalPrice,
    deleteOrderItems,
    deleteOrder
};
