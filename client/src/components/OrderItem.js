import React, { useState, useEffect } from 'react';

export default function OrderItem({order}) {
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all order items
    useEffect(() => {
        const obtainOrderItems = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/home/${order.product_id}`);
                if (!response.ok) throw new Error('Failed to fetch products');
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

    // Handles cancel order events
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
    if (error) return <div>Error: { error }</div>;

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
        <div className="flex items-center space-x-4">
            <img
            alt={product.name}
            src={product.image_url}
            className="h-24 w-24 object-cover rounded-md"
            />
            <div>
            <p className="text-lg font-semibold text-gray-800">{product.name}</p>
            <p className="text-gray-600">Quantity: {order.quantity}</p>
            <span className="text-sm text-gray-800 font-semibold">Total: {order.total_price}</span>
            <p className="text-sm text-gray-500">Status: {order.status}</p>
            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <button
            onClick={handleCancelOrder}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
            Cancel Order
            </button>
        </div>
        </div>
    );
};