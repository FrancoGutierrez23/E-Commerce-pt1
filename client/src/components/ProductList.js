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
                if (!response.ok) throw new Error('Failed to fetch products');
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

    if (loading) return <div className='p-20 text-gray-500 text-lg'>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                <li key={product.id} className="flex justify-center w-full">
                    <Product product={product} />
                </li>
                ))}
            </ul>
        </section>
    );
}

