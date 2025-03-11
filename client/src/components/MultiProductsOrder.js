import React from "react";
import OrderItemDetail from "./OrderItemDetail";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MultiProductsOrder({ orders }) {
  const orderId = orders[0].order_id;

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting order:", errorData);
        return;
      }
      await response.json();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-4">
      <h3 className="text-lg font-bold ">Order </h3>
      <p className="text-gray-500 font-bold tex-sm pb-3">#{orderId}</p>
      {orders.map((order) => (
        <OrderItemDetail key={order.key} order={order} />
      ))}
      <div className="mt-4">
        <button
          onClick={handleCancelOrder}
          className="px-4 py-2 right-0 relative bg-indigo-600 text-white rounded-md hover:bg-indigo-800 transition"
        >
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </button>
      </div>
    </div>
  );
}
