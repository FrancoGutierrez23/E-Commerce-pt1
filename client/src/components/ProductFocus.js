import React, { useState, useEffect } from "react";
import RatingsDistribution from "./RatingsDistribution";
import DetailsTable from "./DetailsTable";
import AddToCartModal from "./modals/AddToCartModal";
import DirectPurchaseModal from "./modals/DirectPurchaseModal";
import DirectCheckoutForm from "./DirectCheckoutForm";
import fetchUserStatus from "./utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const stripePromise = loadStripe(
  "pk_test_51QmFViPsLGexrMsUOP25sWLLwZ7rYE3o252lzmAXUAQTPbq1U7aJ61UBIsrfcy8jlokHXADmYeh7SC0eNgPFML8e00PUuWHzu8"
);

export default function ProductFocus() {
  const [product, setProduct] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({ distribution: [], average: 0 });
  const [showAlert, setShowAlert] = useState(false);

  // For Add to cart option
  const [isCartModalOpen, setCartModalOpen] = useState(false);

  // For Buy option
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [directPurchaseQuantity, setDirectPurchaseQuantity] = useState(null);
  const [isDirectCheckoutOpen, setDirectCheckoutOpen] = useState(false);

  const productId = window.location.pathname.split("/home/")[1];

  // Fetch product when the component mounts
  useEffect(() => {
    const obtainProduct = async () => {
      try {
        const productId = window.location.pathname.split("/home/")[1];
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/home/${productId}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtainProduct();
  }, []);

  // Fetch ratings data for the product
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/ratings/${productId}`
        );
        if (!response.ok) throw new Error("Failed to fetch ratings");
        const ratingsData = await response.json();
        setRatings(ratingsData);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (productId) {
      fetchRatings();
    }
  }, [productId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUserStatus(userId, setUserId, token);
  }, [userId]);

  const handleAddToCart = async (quantity) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        throw Error("test");
      } else if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Show the alert
      setShowAlert(200);
      // Hide the alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error(err.message);
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        className="pt-20 w-full flex justify-center content-center"
      >
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
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
          src={product.image_url}
          className="w-11/12 object-cover rounded-md"
        />
      </figure>

      <div className="flex flex-col w-1/3">
        <h2 className="mt-1 text-2xl font-bold text-gray-800">
          {product.name}
        </h2>
        <p>Stock: {product.stock_quantity}</p>
        <p className="text-gray-500">
          {product.quantity_sold === 0
            ? `Not sells yet`
            : `${product.quantity_sold} sold`}
        </p>
        <span className="mt-3 block text-xl font-semibold text-green-500">
          ${product.price}
        </span>
        <span className="text-lg pt-1">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
          {Number(ratings.average).toFixed(1)} / 5{" "}
        </span>
      </div>

      <div className="w-full">
        <div className="mt-4 flex space-x-4">
          {/* When Buy is clicked, open the Direct Purchase modal */}
          <button
            onClick={() => {
              userId?
              setBuyModalOpen(true) :
              setShowAlert(403);
              setTimeout(() => setShowAlert(false), 4000);
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
          Description: <br></br>
          {product.description}
        </p>

        <DetailsTable productId={productId} />

        {/* Ratings Section */}
        <RatingsDistribution
          distribution={ratings.distribution}
          average={ratings.average}
          className="w-full"
        />
      </div>

      {isCartModalOpen && (
        <AddToCartModal
          product={product}
          onClose={() => setCartModalOpen(false)}
          onConfirm={handleAddToCart}
        />
      )}

      {/* Alerts */}
      {showAlert === 200 && (
        <div
          className={`fixed bottom-1 right-2 z-10 transition-opacity duration-300 ${
            showAlert ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="alert p-3 rounded-md bg-green-400 text-white mb-1 z-10">
            <span
              className="closebtn ml-5 text-white font-bold float-right text-xl leading-5 duration-300 cursor-pointer"
              onClick={() => setShowAlert(false)}
            >
              &times;
            </span>
            Added to cart.
          </div>
        </div>
      )}

      {showAlert === 403 && (
        <div
          className={`fixed bottom-1 right-2 z-10 transition-opacity duration-300 ${
            showAlert ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="alert p-3 rounded-md bg-red-400 text-white mb-1 z-10">
            <span
              className="closebtn ml-5 text-white font-bold float-right text-xl leading-5 duration-300 cursor-pointer"
              onClick={() => setShowAlert(false)}
            >
              &times;
            </span>
            Login/Register first.
          </div>
        </div>
      )}

      {isBuyModalOpen && (
        <DirectPurchaseModal
          product={product}
          onClose={() => setBuyModalOpen(false)}
          onConfirm={(quantity) => {
            // Close the quantity-selection modal,
            // store the chosen quantity,
            // and then open the checkout modal.
            setBuyModalOpen(false);
            setDirectPurchaseQuantity(quantity);
            setDirectCheckoutOpen(true);
          }}
        />
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
