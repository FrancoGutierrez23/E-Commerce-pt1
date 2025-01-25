import React, { useState, useEffect } from 'react';

export default function ProductFocus() {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product when the component mounts
    useEffect(() => {
        const obtainProduct = async () => {
            try {
                const productId = window.location.pathname.split('/home/')[1];

                const response = await fetch(`http://localhost:4000/home/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        obtainProduct();
    }, []);

    // Render loading, error, or product list
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div>
            <br></br>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}} ></img>
            <br></br>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <span>{product.price}</span>
            <button>Buy</button>
            <button>Add to cart</button>
        </div>
    )
};