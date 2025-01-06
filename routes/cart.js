const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const { use } = require('./cart.js');


//Get cart for a user
router.get('/', async (req, res) => {
    const {id} = req.body;

    try {
        const result = await db.query('SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('You have not cart yet.');
        }

        res.send(result.rows); // Send the first row of the result
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
});


//Add a item to a existing cart or create a new cart and then add item
router.post('/', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
    //Check for a existing cart
    const checkForCart = await db.query(`SELECT id FROM carts WHERE user_id = $1`, [userId]);
    
    //If cart exist, use the cart_id, if not, create one
    const cartId = checkForCart.rows[0]? 
                   checkForCart.rows[0].id 
                   : (await db.query(`INSERT INTO carts (user_id) VALUES ($1) RETURNING id`, [userId])).rows[0].id;
    
    //Add item to cart and return updated cart           
    await db.query(`INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`, [cartId, productId, quantity]);
    const result = await db.query(`SELECT * FROM cart_items WHERE cart_id = $1`, [cartId]);
    res.send(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    };
});


//Alter quantity
router.put('/', async (req, res) => {
    const {userId, quantity, productId} = req.body;
    

    try {
        const result = await db.query(
            'UPDATE cart_items SET quantity = $1 WHERE product_id = $2 AND cart_id = (SELECT id FROM carts WHERE user_id = $3)', 
            [quantity, productId, userId]
        );

        const cartId = await db.query(`SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)`, [userId]);

        if (result.rows.length === 0) {
            return res.send(cartId.rows);
        }

        res.send(result.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
});


router.delete('/', async (req, res) => {
    const { cartItemId } = req.body;

    if (!cartItemId) {
        return res.status(400).json({ error: 'Cart item ID is required for deletion.' });
    }

    try {
        const result = await db.query(
            `DELETE FROM cart_items 
             WHERE id = $1
             RETURNING *;`,
            [cartItemId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        res.status(200).json({
            message: 'Cart item deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});



module.exports = router;