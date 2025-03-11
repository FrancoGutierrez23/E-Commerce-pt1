import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SingleProductOrder({ order }) {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all order items
  useEffect(() => {
    const obtainOrderItems = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/home/${order.product_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    obtainOrderItems();
  }, [order]);

  // Handles cancel order events
  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.order_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting order:", errorData);
        return;
      }
      await response.json();
      window.location.reload();
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4 flex-wrap">
      <div className="flex items-center space-x-4 flex-wrap justify-center">
        <div
          onClick={() => {
            navigate(`/home/${product.id}`);
          }}
          className="cursor-pointer hover:underline text-gray-800 hover:text-indigo-600"
        >
          <figure className="my-3">
            <img
              alt={product.name}
              src={product.image_url}
              className="h-40 w-40 object-cover mx-auto rounded-md"
            />
          </figure>
        </div>

        <div>
          <a
            href={`/home/${product.id}`}
            className="block text-lg font-semibold hover:underline hover:text-indigo-600"
          >
            {product.name}
          </a>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
          <span className="text-sm text-gray-800 font-semibold">
            Product price: ${order.price}
          </span>
          <p className="text-sm text-gray-500">Status: {order.status}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleCancelOrder}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 transition"
        >
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </button>
      </div>
    </div>
  );
}
