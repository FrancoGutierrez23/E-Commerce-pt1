import React, { useState, useEffect } from 'react';
import AddToCartModal from './modals/AddToCartModal';
import fetchUserStatus from './utils';

export default function ProductFocus() {
    const [product, setProduct] = useState([]);
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    // Fetch product when the component mounts
    useEffect(() => {
        const obtainProduct = async () => {
            try {
                const productId = window.location.pathname.split('/home/')[1];
                const response = await fetch(`${process.env.REACT_APP_API_URL}/home/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch product');
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserStatus(userId, setUserId, token);
    }, [userId])
    
    // Handle adding items to cart
    const handleAddToCart = async (quantity) => {
        // Send fetch request to add to cart
        fetch(`${process.env.REACT_APP_API_URL}/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              productId: product.id,
              quantity,
              price: product.price,
            }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to add to cart");
              return res.json();
            })
            .then((data) => {
              alert("Product added to cart successfully!");
            })
            .catch((err) => {
              console.error(err.message);
              alert("Failed to add to cart.");
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <section className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <figure className="flex justify-center">
          <img
            alt={product.name}
            src={product.image_url}
            className="h-40 w-40 object-cover rounded-md"
          />
        </figure>
        
        <h2 className="mt-4 text-2xl font-bold text-gray-800">{product.name}</h2>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <span className="mt-3 block text-xl font-semibold text-green-600">${product.price}</span>

        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Buy
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Add to cart
          </button>
        </div>

        {isModalOpen && (
          <AddToCartModal
            product={product}
            onClose={() => setModalOpen(false)}
            onConfirm={handleAddToCart}
          />
        )}
      </section>
    )
};