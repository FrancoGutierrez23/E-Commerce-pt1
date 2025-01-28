import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Checkout() {
    const location = useLocation();
    const { orderId } = location.state || {};

    return (
        <div>
            <h1>Checkout Complete</h1>
            {orderId ? (
                <p>Your order ID is: {orderId}</p>
            ) : (
                <p>No order details found.</p>
            )}
        </div>
    );
}
