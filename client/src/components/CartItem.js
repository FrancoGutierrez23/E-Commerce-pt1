import React, {useEffect, useState} from 'react';

export default function CartItem({ cartItem, userId, onUpdateQuantity }) {
    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState(cartItem.quantity);
    // Fetch cart items
    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/home/${cartItem.product_id}`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProduct(data);
            } catch(error) {
                setError(error.message);;
            }
        };

        obtainCartItems()
    }, [cartItem])

    // Remove cart item handler
    const handleRemove = async (e) => {
        const cartItemId = { cartItemId: cartItem.id };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({cartItemId, price: product.price, quantity: cartItem.quantity }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error deleting item:', errorData);
                return;
            }
    
            const data = await response.json();
            console.log('Deleted:', data);
            window.location.reload();
        } catch (error) {
            console.error('Request error:', error);
        }
    };

    // Handle edit and save 
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (newQuantity < 1) {
            setError('Quantity must be at least 1');
            return;
        }

        const price = cartItem.price;

        try {
            await onUpdateQuantity(cartItem.product_id, newQuantity, price);
            setIsEditing(false); // Close edit mode after successful update
        } catch (error) {
            setError('Failed to update quantity');
            console.error(error);
        }
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
  <div className="flex items-center space-x-4">
    <img
      alt={product.name}
      src={product.image_url}
      className="h-24 w-24 object-cover rounded-md"
    />
    <div>
      <h4 className="text-lg font-semibold text-gray-800">
        <a href={`/home/${product.id}`} className="hover:underline">{product.name}</a>
      </h4>
      <span className="text-gray-600">Total: ${Math.round(product.price * cartItem.quantity)}</span>
    </div>
  </div>

  <div className="flex items-center space-x-4">
    {isEditing ? (
      <>
        <input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(Number(e.target.value))}
          min="1"
          className="w-16 px-2 py-1 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSaveClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      </>
    ) : (
      <>
        <span className="text-gray-700">Quantity: {cartItem.quantity}</span>
        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
        >
          Edit Quantity
        </button>
      </>
    )}

    <button
      onClick={handleRemove}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      Remove
    </button>
  </div>
</div>
    );
}