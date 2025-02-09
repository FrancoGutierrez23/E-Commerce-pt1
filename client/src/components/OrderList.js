import React, { useState, useEffect } from 'react';
import OrderItem from './OrderItem';

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders when the component mounts
    useEffect(() => {
        const obtainOrders = async () => {
            try {
                const userId = window.location.pathname.split('/orders/')[1];
                const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data["orders"]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtainOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {orders.map((order) => (
                <li key={order.key}>
                    <OrderItem order={order} ></OrderItem>
                </li>
            ))}
        </ul>
    );
}