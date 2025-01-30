import React, {useEffect, useState} from 'react';

export default function CartItem({cartItem}) {
    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const response = await fetch(`https://localhost:4000/home/${cartItem.product_id}`);
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
            const response = await fetch(`https://localhost:4000/cart`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItemId),
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
    

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <br></br>
            <h4 href={`/home/${product.id}`}>{product.name}</h4>
            <br></br>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}} ></img>
            <br></br>
            <span>total: ${product.price * cartItem.quantity}</span>
            <br></br>
            <span>Quantity: {cartItem.quantity}</span>
            <br></br>
            <button onClick={handleRemove} >Remove</button>
        </div>
    );
}