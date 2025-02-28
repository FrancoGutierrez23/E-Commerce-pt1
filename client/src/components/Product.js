import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Product({ product }) {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({ distribution: [], average: 0 });
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/ratings/${product.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch ratings");
        const ratingsData = await response.json();
        setRatings(ratingsData);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (product.id) {
      fetchRatings();
    }
  }, [product.id]);

  return (
    <article className="max-w-sm w-11/12 bg-white shadow-lg rounded-lg overflow-hidden p-4 transform transition-transform duration-300 hover:scale-105 will-change-transform ">
      <div
        onClick={() => {
          navigate(`/home/${product.id}`);
        }}
        className="cursor-pointer hover:underline text-gray-800 hover:text-indigo-600"
      >
        <a
          href={`/home/${product.id}`}
          className="block text-lg font-semibold hover:underline hover:text-indigo-600"
        >
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
      <div className="max-h-14">
        <p className="mt-2 text-gray-700 truncate">{product.description}</p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-lg text-green-500">${product.price}</span>
        {ratings.average === 0 ? (
          <p></p>
        ) : (
          <span className="text-lg">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" /> 
             {Number(ratings.average).toFixed(1)} / 5
          </span>
        )}
      </div>
    </article>
  );
}
