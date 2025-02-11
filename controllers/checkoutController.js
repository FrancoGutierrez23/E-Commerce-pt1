const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');

//Checkout controller
const cartCheckout = async (req, res) => {
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

const itemCheckout = async (req, res) => {
    const { productId } = req.params;
    const { quantity, price, userId } = req.body;

    if(!userId) {
        return res.status(400).json({ error: 'Missing User ID' });
    };

    const totalPrice = quantity * price;

    try {
        // Create new order
        const orderResult = await orderModel.createOrder(userId, totalPrice);
        const orderId = orderResult.rows[0].id;

        // Add the product as an order item
        await orderModel.createOrderItem(orderId, productId, quantity, price);

        res.status(201).json({ message: 'Checkout successful', orderId })
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

module.exports = {
    cartCheckout,
    itemCheckout
};