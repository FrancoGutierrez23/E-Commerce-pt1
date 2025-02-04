import React, {useEffect, useState} from 'react';

export default function CartItem({ cartItem, userId, onUpdateQuantity }) {
    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState(cartItem.quantity);

    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/home/${cartItem.product_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProduct(data);
            } catch(error) {
                setError(error.message);;
            }
        };

        obtainCartItems()
    }, [cartItem])

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
    console.log(cartItem)

    return (
        <div>
            <br></br>
            <h4 href={`/home/${product.id}`}>{product.name}</h4>
            <br></br>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}} ></img>
            <br></br>
            <span>total: ${Math.round(product.price * cartItem.quantity)}</span>
            <br></br>
            {isEditing ? (
                <>
                    <input 
                        type="number" 
                        value={newQuantity} 
                        onChange={(e) => setNewQuantity(Number(e.target.value))}
                        min="1"
                    />
                    <button onClick={handleSaveClick}>Save</button>
                </>
            ) : (
                <>
                    <span>Quantity: {cartItem.quantity}</span>
                    <button onClick={handleEditClick}>Edit Quantity</button>
                </>
            )}
            <br></br>
            <button onClick={handleRemove} >Remove</button>
        </div>
    );
}