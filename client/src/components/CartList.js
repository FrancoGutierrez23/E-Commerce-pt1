import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CartItem from './CartItem';
import CheckoutForm from './CheckoutForm';
import fetchUserStatus from './utils';

const stripePromise = loadStripe('pk_test_51QmFViPsLGexrMsUOP25sWLLwZ7rYE3o252lzmAXUAQTPbq1U7aJ61UBIsrfcy8jlokHXADmYeh7SC0eNgPFML8e00PUuWHzu8');

export default function CartList() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserStatus(userId, setUserId, token);
    }, [userId])

    // Fetch products when the component mounts
    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${window.location.pathname.split('/cart/')[1]}`);
                if (response.status === 404) throw new Error('You have not cart yet');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        obtainCartItems();
    }, [userId]);

    // Recalculate total when cartItems changes
    useEffect(() => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setCartTotal(Math.round(total * 100) / 100);
    }, [cartItems]);

    const cartId = cartItems.length > 0 ? cartItems[0].cart_id : null;

    // Handles cart checkout event
    const handleCheckout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkout/${cartItems[0]?.cart_id}`, {
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

    // Handle quantity updates
    const handleUpdateQuantity = async (productId, newQuantity, price) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity: newQuantity, price}),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating quantity:', errorData);
                return;
            }
    
            const updatedCart = await response.json();
            setCartItems(updatedCart); // Update cart state
    
            // Update the cart total
            let newTotal = updatedCart.reduce((total, item) => total + item.price * item.quantity, 0);
            setCartTotal(Math.round(newTotal * 100) / 100); // Update cart total
        } catch (error) {
            console.error('Request error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <ul>
                {cartItems.map((cartItem) => (
                    <li key={cartItem.id}>
                        <CartItem cartItem={cartItem} userId={userId} onUpdateQuantity={handleUpdateQuantity} />
                    </li>
                ))}
            </ul>
            <div>Total: ${cartTotal}</div> {/* Render the total */}
            <button onClick={handleCheckout} disabled={cartItems.length === 0}>
                Checkout
            </button>
            <Elements stripe={stripePromise}>
                <CheckoutForm totalAmount={cartTotal} userId={userId} cartId={cartId} />
            </Elements>
        </div>
    );
}

