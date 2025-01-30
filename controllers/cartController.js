const cartModel = require('../models/cartModel.js');

const getCart = async (req, res) => { 
    try {
        console.log(req.params.id)
        const requestedUserId = req.params.id;

        const result = await cartModel.getCartItems(requestedUserId);

        if (result.rows.length === 0) {
            return res.status(404).send('You have not cart yet.');
        }
        res.send(result.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
};

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

const updateQuantity = async (req, res) => {
    const { userId, quantity, productId, price } = req.body;

    // Validate input
    if (!userId || !productId || quantity === undefined) {
        return res.status(400).json({ error: 'Missing userId, productId, or quantity' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }

    try {
        // Update the cart item quantity
        const result = await cartModel.updateItemQuantity(userId, quantity, productId, price);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Cart item not found or not updated' });
        }

        // Fetch updated cart items and return them
        const cartItems = await cartModel.getCartItems(userId);
        res.status(200).json(cartItems.rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Error querying database' });
    }
};


const deleteItem = async (req, res) => {
    const cartItemId = req.body.cartItemId.cartItemId;
    const { price, quantity } = req.body;
    console.log(req.body)
    if (!cartItemId) {
        return res.status(400).json({ error: 'Cart item ID is required for deletion.' });
    }

    try {
        const result = await cartModel.deleteCartItem(cartItemId, quantity, price);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }
        res.status(200).json({ message: 'Cart item deleted successfully!' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

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
