const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.post('/create-payment-intent', async (req, res) => {
    const { totalAmount, cartId } = req.body; 
    if (!totalAmount || totalAmount <= 0 || isNaN(totalAmount)) {
        return res.status(400).json({ error: 'Invalid total amount' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'usd',
            metadata: { cartId }
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

router.post('/create-payment-intent/direct', async (req, res) => {
    const { totalAmount, productId, quantity } = req.body;
    
    // Validate inputs
    if (!totalAmount || totalAmount <= 0 || isNaN(totalAmount)) {
        return res.status(400).json({ error: 'Invalid total amount' });
    }
    if (!productId) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert dollars to cents
            currency: 'usd',
            metadata: { productId, quantity }
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating direct purchase payment intent:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

router.post('/:cartId', checkoutController.cartCheckout);

router.post('/direct/:productId', checkoutController.itemCheckout);

module.exports = router;
