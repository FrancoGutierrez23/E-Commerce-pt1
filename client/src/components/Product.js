import React from 'react';

export default function Product({product}) {
    return (
        <article className="max-w-sm w-11/12 bg-white shadow-lg rounded-lg overflow-hidden p-4 transform transition-transform duration-300 hover:scale-105 will-change-transform">
            <a href={`/home/${product.id}`} className="block text-lg font-semibold text-blue-600 hover:underline">
                {product.name}
            </a>
            <figure className="mt-3">
                <img
                    alt={product.name}
                    src={product.image_url}
                    className="h-40 w-40 object-cover mx-auto rounded-md"
                />
            </figure>
            <p className="mt-2 text-gray-700">{product.description}</p>
            <span className="block mt-3 text-xl font-bold text-green-600">${product.price}</span>
        </article>

    );
}