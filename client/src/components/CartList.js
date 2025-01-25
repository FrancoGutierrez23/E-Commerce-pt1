import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';

export default function CartList() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products when the component mounts
    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const userId = window.location.pathname.split('/cart/')[1];
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
    }, []);

    // Render loading, error, or product list
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {cartItems.map((cartItem) => (
                <li key={cartItem.id}>
                    <CartItem cartItem={cartItem} ></CartItem>
                </li>
            ))}
        </ul>
    );
}

