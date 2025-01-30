import React, {useEffect, useState} from 'react';

export default function CartItem({cartItem}) {
    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtainCartItems = async () => {
            try {
                const response = await fetch(`httpsssssss://localhost:4000/home/${cartItem.product_id}`);
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
        </div>
    );
}