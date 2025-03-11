import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderItemDetail({ order }) {
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/home/${order.product_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [order.product_id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex items-center space-x-4 max-w-80 flex-wrap mt-3 justify-center">
      <figure
        onClick={() => navigate(`/home/${product.id}`)}
        className="mt-3 cursor-pointer"
      >
        <img
          alt={product.name}
          src={product.image_url}
          className="h-40 w-40 object-cover mx-auto rounded-md"
        />
      </figure>
      <div>
        <h4
          className="font-semibold text-lg hover:underline hover:text-indigo-600 cursor-pointer"
          onClick={() => navigate(`/home/${product.id}`)}
        >
          {product.name}
        </h4>
        <p className="text-gray-600">Quantity: {order.quantity}</p>
        <span className="text-sm text-gray-800 font-semibold">
          Product price: ${order.price}
        </span>
        <p className="text-sm text-gray-500">Status: {order.status}</p>
        <p className="text-sm text-gray-500">
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
