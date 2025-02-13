import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product({product}) {
    const navigate = useNavigate();

    return (
        <article className="max-w-sm w-11/12 bg-white shadow-lg rounded-lg overflow-hidden p-4 transform transition-transform duration-300 hover:scale-105 will-change-transform ">
            <div onClick={() => {
                            navigate(`/home/${product.id}`);
                            //window.location.href = `${process.env.FRONTEND_URL}/home/${product.id}`}
                            }}
                 className='cursor-pointer hover:underline text-gray-800 hover:text-blue-600'>
                <a href={`/home/${product.id}`} className="block text-lg font-semibold hover:underline hover:text-blue-600">
                    {product.name}
                </a>
                <figure className="mt-3">
                    <img
                        alt={product.name}
                        src={product.image_url}
                        className="h-40 w-40 object-cover mx-auto rounded-md"
                    />
                </figure>
            </div>
            <div className='max-h-14'>
            <p className="mt-2 text-gray-700 truncate">{product.description}</p>
            </div>
            <span className="block mt-3 text-sm font-bold text-green-600">${product.price}</span>
        </article>

    );
}