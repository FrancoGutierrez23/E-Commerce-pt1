import React, { useState, useEffect } from 'react';
import Product from './Product';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products when the component mounts
    useEffect(() => {
        const obtainProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/home`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtainProducts();
    }, []);

    // Render loading, error, or product list
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {products.map((product) => (
                <li key={product.id}>
                    <Product product={product} ></Product>
                </li>
            ))}
        </ul>
    );
}

