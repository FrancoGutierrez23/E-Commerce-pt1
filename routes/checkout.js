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

router.post('/:cartId', checkoutController.checkout);

module.exports = router;
