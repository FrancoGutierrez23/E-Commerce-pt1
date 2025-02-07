import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function CheckoutForm({ totalAmount, userId, cartId }) {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!cartId) return;
        // Fetch clientSecret from backend when the component loads
        fetch(`${process.env.REACT_APP_API_URL}/checkout/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalAmount, cartId }),
        })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
        .catch(error => console.error('Error fetching clientSecret:', error));
    }, [totalAmount, cartId]);

    // Handle checkout form submits
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            console.error('Payment error:', error);
        } else {
            console.log('Payment successful:', paymentIntent);
        
        // After successful payment, complete the checkout process
        await fetch(`${process.env.REACT_APP_API_URL}/checkout/${cartId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        // Redirect to orders page
        navigate(`/orders/${userId}`, { state: { orderId: paymentIntent.id } });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || !elements}>
                Pay ${totalAmount}
            </button>
        </form>
    );
}
