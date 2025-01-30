import React, { useState, useEffect } from 'react';

export default function OrderItem({order}) {
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtainOrderItems = async () => {
            try {
                const response = await fetch(`https://localhost:4000/home/${order.product_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProduct(data);
            } catch(error) {
                setError(error.message);;
            } finally {
                setLoading(false);
            }
        };

        obtainOrderItems()
    }, [order])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}}></img>
            <p>{product.name}</p>
            <p>Quantity: {order.quantity}</p>
            <span>Total: {order.total_price}</span>
            <p>Status: {order.status}</p>
            <br></br>
        </div>
    );
};