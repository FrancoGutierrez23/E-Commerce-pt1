import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CartItem from './CartItem';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51QmFViPsLGexrMsUOP25sWLLwZ7rYE3o252lzmAXUAQTPbq1U7aJ61UBIsrfcy8jlokHXADmYeh7SC0eNgPFML8e00PUuWHzu8');

export default function CartList() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = window.location.pathname.split('/cart/')[1];

    // Fetch products when the component mounts
    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const response = await fetch(`http://localhost:4000/cart/${userId}`);
                if (response.status === 404) {
                    throw new Error('You have not cart yet')
                } else if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setCartItems(data);
                } else if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        obtainCartItems();
    }, [userId]);

    let cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cartTotal = Math.round(cartTotal * 100) / 100;

    const cartId = cartItems.length > 0 ? cartItems[0].cart_id : null;


    const handleCheckout = async () => {
        try {
            const response = await fetch(`http://localhost:4000/checkout/${cartItems[0]?.cart_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/orders/${userId}`, { state: { orderId: data.orderId } })
            } else {
                setError('Failed to process checkout. Please try again.');
            }
        } catch (error) {
            setError('An error occurred during checkout.');
        }
    };

    // Render loading, error, or product list
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <ul>
                {cartItems.map((cartItem) => (
                    <li key={cartItem.id}>
                        <CartItem cartItem={cartItem} />
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckout} disabled={cartItems.length === 0}>
                Checkout
            </button>
            <Elements stripe={stripePromise}>
                <CheckoutForm totalAmount={cartTotal} userId={userId} cartId={cartId} />
            </Elements>
        </div>
    );
}

