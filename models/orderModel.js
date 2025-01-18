const db = require('../db/index.js');

const getOrdersByUserId = async (userId) => {
    return await db.query(
        `SELECT * FROM order_items WHERE order_id = (SELECT id FROM orders WHERE user_id = $1)`,
        [userId]
    );
};

const createOrder = async (userId, totalPrice) => {
    return await db.query(
        `INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id;`,
        [userId, totalPrice]
    );
};

const createOrderItem = async (orderId, productId, quantity, price) => {
    return await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4) RETURNING id;`,
        [orderId, productId, quantity, price]
    );
};

const updateOrderItemQuantity = async (quantity, orderItemId) => {
    return await db.query('UPDATE order_items SET quantity = $1 WHERE id = $2', [quantity, orderItemId]);
};

const updateOrderTotalPrice = async (updatedTotalPrice, orderId) => {
    return await db.query('UPDATE orders SET total_price = $1 WHERE id = $2', [updatedTotalPrice, orderId]);
};

const deleteOrderItems = async (orderId) => {
    return await db.query(
        `DELETE FROM order_items WHERE order_id = $1 RETURNING *;`,
        [orderId]
    );
};

const deleteOrder = async (orderId) => {
    return await db.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
};

module.exports = {
    getOrdersByUserId,
    createOrder,
    createOrderItem,
    updateOrderItemQuantity,
    updateOrderTotalPrice,
    deleteOrderItems,
    deleteOrder
};
