import React from 'react';

export default function Product({product}) {
    return (
        <div>
            <br></br>
            <a href='/home'>{product.name}</a>
            <br></br>
            <img alt={product.name} src={product.image_url} style={{height: '150px', width: '150px'}} ></img>
            <p>{product.description}</p>
            <span>{product.price}</span>
        </div>
    );
}