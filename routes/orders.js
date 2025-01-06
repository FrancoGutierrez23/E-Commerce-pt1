const express = require('express');
const router = express.Router();
const db = require('../db/index.js');


//Get all orders for a user
router.get('/', async (req, res) => {
    const {userId} = req.body;

    try {
        const result = await db.query(`SELECT * FROM order_items WHERE order_id = (SELECT id FROM orders WHERE user_id = $1)`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User have not orders yet' });
        };
        res.status(200).json({
            orders: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

//Make an order of a single product (no cart)
router.post('/', async (req, res) => {
    const {userId, productId, quantity, itemPrice} = req.body;
    const totalPrice = quantity * itemPrice;

    try {
        const orderResult = await db.query(`INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id;`, [userId, totalPrice]);
        const orderId = await orderResult.rows[0].id;
        const orderItemResult = await db.query(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING id;`, [orderId, productId, quantity, itemPrice]);
        const orderItemId = await orderItemResult.rows[0].id;
        const result = await db.query(`SELECT * FROM order_items WHERE id = $1;`, [orderItemId]);
        res.send(result.rows);

    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});


//Alter quantity
router.put('/', async (req, res) => {
    const {quantity, productPrice, orderId, orderItemId} = req.body;
    const updatedTotalPrice = quantity * productPrice;

    try {
        await db.query('UPDATE order_items SET quantity = $1 WHERE id = $2', [quantity, orderItemId]);

        await db.query(`UPDATE orders SET total_price = $1 WHERE id = $2`, [updatedTotalPrice, orderId])

        const result = await db.query(`SELECT * FROM order_items WHERE id = $1;`, [orderItemId])
        res.send(result.rows)
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    };
});


//Remove order
router.delete('/', async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required for deletion.' });
    }

    try {
        const result = await db.query(
            `DELETE FROM order_items
             WHERE order_id = $1
             RETURNING *;`,
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        await db.query(`DELETE FROM orders WHERE id = $1`, [orderId]);

        res.status(200).json({
            message: 'Order deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

module.exports = router;