import React, { useState, useEffect } from 'react';
import AddToCartModal from './modals/AddToCartModal';
import DirectPurchaseModal from './modals/DirectPurchaseModal';
import DirectCheckoutForm from './DirectCheckoutForm';
import fetchUserStatus from './utils';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QmFViPsLGexrMsUOP25sWLLwZ7rYE3o252lzmAXUAQTPbq1U7aJ61UBIsrfcy8jlokHXADmYeh7SC0eNgPFML8e00PUuWHzu8');

export default function ProductFocus() {
    const [product, setProduct] = useState([]);
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // For Add to cart option
    const [isCartModalOpen, setCartModalOpen] = useState(false);

    // For Buy option
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);
    const [directPurchaseQuantity, setDirectPurchaseQuantity] = useState(null);
    const [isDirectCheckoutOpen, setDirectCheckoutOpen] = useState(false);


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
      <section className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 relative flex flex-wrap justify-between">
          <figure className="flex justify-start w-2/3">
            <img
              alt={product.name}
              src={product.image_url}
              className="w-11/12 object-cover rounded-md"
            />
          </figure>
          
          <div className='flex flex-col w-1/3'>
            <h2 className="mt-1 text-2xl font-bold text-gray-800">{product.name}</h2>
            <p>Stock: {product.stock_quantity}</p>
            <span className="mt-3 block text-xl font-semibold text-green-600">${product.price}</span>
          </div>

      <div className="mt-4 flex space-x-4">
        {/* When Buy is clicked, open the Direct Purchase modal */}
        <button
          onClick={() => setBuyModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Buy now
        </button>
        <button
          onClick={() => setCartModalOpen(true)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
        >
          Add to cart
        </button>
      </div>

      <p className="mt-2 text-gray-700">Description: <br></br>{product.description}</p>

      {isCartModalOpen && (
        <AddToCartModal
          product={product}
          onClose={() => setCartModalOpen(false)}
          onConfirm={handleAddToCart}
        />
      )}

      {isBuyModalOpen && (
        <DirectPurchaseModal
          product={product}
          onClose={() => setBuyModalOpen(false)}
          onConfirm={(quantity) => {
            // Close the quantity-selection modal,
            // store the chosen quantity,
            // and then open the checkout modal.
            setBuyModalOpen(false);
            setDirectPurchaseQuantity(quantity);
            setDirectCheckoutOpen(true);
          }}
        />
      )}

      {isDirectCheckoutOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setDirectCheckoutOpen(false)}
              className="absolute top-2 right-2 text-red-500 text-xl font-bold"
            >
              X
            </button>
            <Elements stripe={stripePromise}>
            <DirectCheckoutForm
              totalAmount={product.price * directPurchaseQuantity}
              userId={userId}
              product={product}
              quantity={directPurchaseQuantity}
            />
            </Elements>
          </div>
        </div>
      )}
    </section>
    )
};