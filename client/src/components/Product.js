import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Product({ product }) {
  const navigate = useNavigate();

    useEffect(() => {
      if (product?.image_url) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = product.image_url;
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      }
    }, [product?.image_url]);

  return (
    <article className="max-w-sm w-11/12 bg-white shadow-lg rounded-lg overflow-hidden p-4 transform transition-transform duration-300 hover:scale-105 will-change-transform">
      <div
        onClick={() => navigate(`/home/${product.id}`)}
        className="cursor-pointer hover:underline text-gray-800 hover:text-indigo-600"
      >
        <a href={`/home/${product.id}`} className="block text-lg font-semibold">
          {product.name}
        </a>
        <figure className="mt-3">
          <img
            alt={product.name}
            src={`${product.image_url}?w=160&h=160`}
            srcSet={`
              ${product.image_url}?w=160&h=160 1x,
              ${product.image_url}?w=320&h=320 2x
            `}
            width="160"
            height="160"
            className="w-auto max-h-40 mx-auto rounded-md"
          />
        </figure>
      </div>
      <div className="max-h-14">
        <p className="mt-2 text-gray-700 truncate">{product.description}</p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-lg text-green-500">${product.price}</span>
        {product.ratings && product.ratings.average > 0 && (
          <span className="text-lg">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
            {Number(product.ratings.average).toFixed(1)} / 5
          </span>
        )}
      </div>
    </article>
  );
}

