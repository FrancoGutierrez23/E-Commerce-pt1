const cartModel = require('../models/cartModel');

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
    checkout,
};