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
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add {product.name} to Cart</h3>
        <p>Total price: ${product.price * quantity}</p>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
        </label>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
