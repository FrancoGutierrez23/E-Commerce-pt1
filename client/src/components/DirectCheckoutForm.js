// DirectCheckoutForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function DirectCheckoutForm({ totalAmount, userId, product, quantity }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Create PaymentIntent for a direct purchase
    fetch(`${process.env.REACT_APP_API_URL}/checkout/create-payment-intent/direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalAmount,
        productId: product.id,
        quantity,
      }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(error => console.error('Error fetching clientSecret:', error));
  }, [totalAmount, product, quantity]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      console.error('Payment error:', error);
      // Optionally show error feedback to user
    } else {
      console.log('Payment successful:', paymentIntent);

      // After successful payment, create the order (using your order endpoint)
      await fetch(`${process.env.REACT_APP_API_URL}/checkout/direct/${product.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          price: product.price,
          userId,
        }),
      });

      // Redirect to orders page (or show order confirmation)
      navigate(`/orders/${userId}`, { state: { orderId: paymentIntent.id } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Checkout</h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Payment Information
        </label>
        <div className="border p-4 rounded-md">
          <CardElement className="p-2" />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-lg font-semibold text-gray-800">Total: ${totalAmount}</span>
        <button
          type="submit"
          disabled={!stripe || !elements}
          className={`px-6 py-3 text-white font-semibold rounded-md transition ${
            !stripe || !elements ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Pay ${totalAmount}
        </button>
      </div>
    </form>
  );
}
