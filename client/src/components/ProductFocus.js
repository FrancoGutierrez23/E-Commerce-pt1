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
        <div>
            <br></br>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}} ></img>
            <br></br>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <span>${product.price}</span>
            <button>Buy</button>
            <button onClick={() => setModalOpen(true)}>Add to cart</button>

            {isModalOpen && (
                <AddToCartModal
                    product={product}
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleAddToCart}
                />
            )}
        </div>
    )
};