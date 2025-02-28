import React, { useState } from "react";

export default function AddToCartModal({ product, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value > 0 ? value : 1); // Prevent invalid quantities
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    onClose(); // Close the modal after confirming
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add {product.name} to Cart</h3>
        
        <p className="text-lg text-gray-700 mb-4">Total price: ${product.price * quantity}</p>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              
              className="w-full mt-2 px-3 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </label>
        </div>
        
        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-200 text-gray-800 rounded-md hover:bg-indigo-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

  );
}
