import React, { useState, useEffect, Suspense } from "react";
import RatingsDistribution from "./RatingsDistribution";
import DetailsTable from "./DetailsTable";
import fetchUserStatus from "./utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DirectCheckoutForm from "./DirectCheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51QmFViPsLGexrMsUOP25sWLLwZ7rYE3o252lzmAXUAQTPbq1U7aJ61UBIsrfcy8jlokHXADmYeh7SC0eNgPFML8e00PUuWHzu8"
);

// Lazy-load modals to reduce the initial bundle size.
const AddToCartModal = React.lazy(() => import("./modals/AddToCartModal"));
const DirectPurchaseModal = React.lazy(() => import("./modals/DirectPurchaseModal"));

export default function ProductFocus() {
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({ distribution: [], average: 0 });
  const [showAlert, setShowAlert] = useState(false);

  // For Add to Cart option
  const [isCartModalOpen, setCartModalOpen] = useState(false);

  // For Buy option
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [directPurchaseQuantity, setDirectPurchaseQuantity] = useState(null);
  const [isDirectCheckoutOpen, setDirectCheckoutOpen] = useState(false);

  const productId = window.location.pathname.split("/home/")[1];
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
  
  // Fetch product and ratings concurrently.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, ratingsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/home/${productId}`),
          fetch(`${process.env.REACT_APP_API_URL}/ratings/${productId}`)
        ]);
        if (!productRes.ok) throw new Error("Failed to fetch product");
        if (!ratingsRes.ok) throw new Error("Failed to fetch ratings");
        const productData = await productRes.json();
        const ratingsData = await ratingsRes.json();
        setProduct(productData);
        setRatings(ratingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  // Fetch user status only once on mount.
  useEffect(() => {
    const fetch = async() => {
      const token = localStorage.getItem("token");
      setUserId(await fetchUserStatus(token));
    };
    fetch();
  }, []);

  const handleAddToCart = async (quantity) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product.id,
          quantity,
          price: product.price,
        }),
      });

      if (!response.ok && response.status === 403) {
        setShowAlert(403);
        setTimeout(() => setShowAlert(false), 4000);
        throw Error("Unauthorized");
      } else if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
      setShowAlert(200);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) {
    return (
      <div role="status" className="pt-20 w-full flex justify-center">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Spinner paths */}
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 pt-20 relative flex flex-wrap justify-between">
      <figure className="flex justify-start w-2/3">
        <img
          alt={product.name}
          src={`${product.image_url}?w=400&h=400`}
          width="400"
          height="400"
          className="w-11/12 object-cover rounded-md"
        />
      </figure>

      <div className="flex flex-col w-1/3">
        <h2 className="mt-1 text-2xl font-bold text-gray-800">{product.name}</h2>
        <p>Stock: {product.stock_quantity}</p>
        <p className="text-gray-500">
          {product.quantity_sold === 0 ? "Not sold yet" : `${product.quantity_sold} sold`}
        </p>
        <span className="mt-3 block text-xl font-semibold text-green-500">${product.price}</span>
        <span className="text-lg pt-1">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
          {Number(ratings.average).toFixed(1)} / 5
        </span>
      </div>

      <div className="w-full">
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => {
              if (userId) {
                setBuyModalOpen(true);
              } else {
                setShowAlert(403);
                setTimeout(() => setShowAlert(false), 4000);
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 transition"
          >
            Buy now
          </button>
          <button
            onClick={() => setCartModalOpen(true)}
            className="px-4 py-2 bg-indigo-200 text-gray-800 rounded-md hover:bg-indigo-300 transition"
          >
            Add to cart
          </button>
        </div>

        <p className="mt-2 text-gray-700 w-full">
          Description: <br />
          {product.description}
        </p>

        <DetailsTable productId={productId} />

        <RatingsDistribution
          distribution={ratings.distribution}
          average={ratings.average}
          className="w-full"
        />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {isCartModalOpen && (
          <AddToCartModal
            product={product}
            onClose={() => setCartModalOpen(false)}
            onConfirm={handleAddToCart}
          />
        )}

        {isBuyModalOpen && (
          <DirectPurchaseModal
            product={product}
            onClose={() => setBuyModalOpen(false)}
            onConfirm={(quantity) => {
              setBuyModalOpen(false);
              setDirectPurchaseQuantity(quantity);
              setDirectCheckoutOpen(true);
            }}
          />
        )}
      </Suspense>

      {showAlert === 200 && (
        <div className="fixed bottom-1 right-2 z-10 transition-opacity duration-300 opacity-100">
          <div className="alert p-3 rounded-md bg-green-400 text-white mb-1">
            <span
              className="closebtn ml-5 text-white font-bold float-right text-xl cursor-pointer"
              onClick={() => setShowAlert(false)}
            >
              &times;
            </span>
            Added to cart.
          </div>
        </div>
      )}

      {showAlert === 403 && (
        <div className="fixed bottom-1 right-2 z-10 transition-opacity duration-300 opacity-100">
          <div className="alert p-3 rounded-md bg-red-400 text-white mb-1">
            <span
              className="closebtn ml-5 text-white font-bold float-right text-xl cursor-pointer"
              onClick={() => setShowAlert(false)}
            >
              &times;
            </span>
            Login/Register first.
          </div>
        </div>
      )}

      {isDirectCheckoutOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full mx-2 max-w-lg relative">
            <button
              onClick={() => setDirectCheckoutOpen(false)}
              className="absolute top-2 right-2 text-indigo-800 text-xl font-extrabold"
            >
              X
            </button>
            <Elements stripe={stripePromise}>
              <DirectCheckoutForm
                totalAmount={product.price * directPurchaseQuantity}
                userId={userId}
                product={product}
                quantity={directPurchaseQuantity}
              />
            </Elements>
          </div>
        </div>
      )}
    </section>
  );
}
