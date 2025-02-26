import React, { useState, useEffect } from "react";

export default function DetailsTable({ productId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/details/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchDetails();
  }, [productId]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!details) return <div>No details available.</div>;

  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold mb-2">Product Details</h3>
      <table className="min-w-full border-collapse">
        <tbody>
          {details.condition && (
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Condition</td>
              <td className="px-4 py-2">{details.condition}</td>
            </tr>
          )}
          {details.weight && (
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Weight</td>
              <td className="px-4 py-2">{details.weight} kg</td>
            </tr>
          )}
          {details.size && (
            <tr className="border-b">
              <td className="px-4 py-2 font-medium">Size</td>
              <td className="px-4 py-2">{details.size}</td>
            </tr>
          )}
          <tr className="border-b">
            <td className="px-4 py-2 font-medium">Warranty</td>
            <td className="px-4 py-2">
              {details.warranty ? details.warranty : "No warranty"}
            </td>
          </tr>
          {details.main_material && (
            <tr>
              <td className="px-4 py-2 font-medium">Main Material</td>
              <td className="px-4 py-2">{details.main_material}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
