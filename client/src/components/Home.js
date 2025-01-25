import React, { useState, useEffect } from 'react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products when the component mounts
    useEffect(() => {
        const obtainProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/home');
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
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <br></br>
                        <a href='/home'>{product.name}</a>
                        <br></br>
                        <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}} ></img>
                        <p>{product.description}</p>
                        <span>{product.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

