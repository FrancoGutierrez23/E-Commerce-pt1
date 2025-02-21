// RatingsDistribution.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function RatingsDistribution({ distribution, average }) {
  // Convert string counts to numbers & sum them
  const totalCount = distribution.reduce(
    (acc, item) => acc + Number(item.count),
    0
  );

  // Define a fixed list of star values we want to show (5 -> 1)
  const starRatings = [5, 4, 3, 2, 1];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      <p>
        Average Rating: {Number(average).toFixed(1)}/5{' '} 
        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
      </p>
      <p className='text-gray-500'>{`( ${totalCount} user reviews)`}</p>

      <div className="mt-2 space-y-2">
        {starRatings.map((star) => {
          // Find an existing distribution entry for this star value
          const found = distribution.find(
            (item) => Number(item.rating) === star
          );
          const count = found ? Number(found.count) : 0;

          // Calculate the percentage for the filled portion
          const percentage = totalCount ? (count / totalCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center">
              {/* Left: Star Label */}
              <span className="w-12 text-sm text-gray-700 flex items-center">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-500 mr-1"
                />
                {star}
              </span>

              {/* Middle: Bar Container */}
              <div className="flex-1 h-3 bg-gray-200 mx-2 rounded overflow-hidden relative">
                {/* Filled portion (blue) */}
                <div
                  className="h-3 bg-blue-500 rounded"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {/* Right: Count */}
              <span className="text-sm text-gray-700 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
