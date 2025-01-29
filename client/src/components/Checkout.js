import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function Checkout() {
    const location = useLocation();
    const { orderId: orderIdFromState } = location.state || {};
    const { userId } = useParams();
    const [orderId, setOrderId] = useState(orderIdFromState);

    useEffect(() => {
        if (!orderId) {
            fetch(`http://localhost:4000/orders/${userId}/last-order`)
                .then(res => res.json())
                .then(data => setOrderId(data.orderId))
                .catch(err => console.error("Error fetching last order:", err));
        }
    }, [orderId, userId]);

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

