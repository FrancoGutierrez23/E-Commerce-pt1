const cartModel = require('../models/cartModel.js');

// GET cart items controller
const getCart = async (req, res) => { 
    try {
        const requestedUserId = req.params.id;
        const result = await cartModel.getCartItems(requestedUserId);

        if (result.rows.length === 0) return res.status(404).send('You have not cart yet.');
        res.send(result.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
};

// POST cart item controller
const addToCart = async (req, res) => {
    const { userId, productId, quantity, price } = req.body;
    try {
        const result = await cartModel.addItemToCart(userId, productId, quantity, price);
        res.send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// PUT cart item quantity controller
const updateQuantity = async (req, res) => {
    const { userId, quantity, productId, price } = req.body;

    if (!userId || !productId || quantity === undefined) return res.status(400).json({ error: 'Missing userId, productId, or quantity' });

    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'Quantity must be a positive integer' });

    try {
        const result = await cartModel.updateItemQuantity(userId, quantity, productId, price); // Update the cart item quantity
        if (result.rowCount === 0) return res.status(404).json({ error: 'Cart item not found or not updated' });
        // Fetch updated cart items and return them
        const cartItems = await cartModel.getCartItems(userId);
        res.status(200).json(cartItems.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Error querying database' });
    }
};

// DELETE cart item controller
const deleteItem = async (req, res) => {
    const { price, quantity } = req.body;
    const cartItemId = req.body.cartItemId.cartItemId;
    if (!cartItemId) return res.status(400).json({ error: 'Cart item ID is required for deletion.' });
    try {
        const result = await cartModel.deleteCartItem(cartItemId, quantity, price);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cart item not found.' });
        res.status(200).json({ message: 'Cart item deleted successfully!' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// Checkout cart items controller
const checkout = async (req, res) => {
    const { cartId } = req.params;
    const { userId } = req.body;
    try {
        const { orderId } = await cartModel.checkoutCart(cartId, userId);
        res.status(201).json({ message: 'Checkout successful', orderId });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    deleteItem,
    checkout
};
