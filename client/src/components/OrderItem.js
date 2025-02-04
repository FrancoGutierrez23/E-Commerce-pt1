import React, { useState, useEffect } from 'react';

export default function OrderItem({order}) {
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtainOrderItems = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/home/${order.product_id}`);
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

    const handleCancelOrder = async() => {
        console.log(order);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({orderId: order.order_id})
            })

            if(!response.ok) {
                const errorData = await response.json();
                console.error('Error deleting order:', errorData);
                return;
            }

            const data = await response.json();
            console.log('Deleted:', data);
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}}></img>
            <p>{product.name}</p>
            <p>Quantity: {order.quantity}</p>
            <span>Total: {order.total_price}</span>
            <p>Status: {order.status}</p>
            <p>{order.created_at}</p>
            <button onClick={handleCancelOrder}>Cancel Order</button>
            <br></br>
        </div>
    );
};