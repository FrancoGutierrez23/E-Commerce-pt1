import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CartItem from "./CartItem";
import CheckoutForm from "./CheckoutForm";
import fetchUserStatus from "./utils";

const stripePromise = loadStripe(
  "pk_test_51QmFViPsLGexrMsUOP25sWLLwZ7rYE3o252lzmAXUAQTPbq1U7aJ61UBIsrfcy8jlokHXADmYeh7SC0eNgPFML8e00PUuWHzu8"
);

export default function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch products when the component mounts
  useEffect(() => {
    const obtainCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login/register first.");
        setLoading(false);
        return;
      }

      try {
        const fetchedUserId = await fetchUserStatus(token);
        setUserId(fetchedUserId);

        const cartId = window.location.pathname.split("/cart/")[1];
        if (!cartId) {
          throw new Error("Invalid cart ID in URL");
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cart/${cartId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok && response.status === 404) {
          throw Error('You have not cart yet.');
        } else if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    obtainCartItems();
  }, []);

  // Recalculate total when cartItems changes
  useEffect(() => {
    const total = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setCartTotal(Math.round(total * 100) / 100);
  }, [cartItems]);

  const cartId = cartItems.length > 0 ? cartItems[0].cart_id : null;
  // Handle quantity updates
  const handleUpdateQuantity = async (productId, newQuantity, price) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          quantity: newQuantity,
          price,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating quantity:", errorData);
        return;
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart); // Update cart state

      // Update the cart total
      let newTotal = updatedCart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setCartTotal(Math.round(newTotal * 100) / 100); // Update cart total
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  if (loading)
    return (
      <div
        role="status"
        className="pt-20 w-full flex justify-center content-center"
      >
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  if (error)
    return (
      <div className="pt-32 flex justify-around text-xl w-full text-gray-700 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg pt-20">
      <ul className="space-y-4">
        {cartItems.map((cartItem) => (
          <li key={cartItem.id} className="border-b border-gray-300 pb-4">
            <CartItem
              cartItem={cartItem}
              userId={userId}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col justify-between items-center">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            totalAmount={cartTotal}
            userId={userId}
            cartId={cartId}
          />
        </Elements>
      </div>
    </div>
  );
}
