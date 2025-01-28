import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';

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
        </div>
    );
}

