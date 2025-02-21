const db = require('../db/index.js');

// Get rating distribution for a specific product

const getRatingsDistribution = async (productId) => {
  return await db.query( `
    SELECT rating, COUNT(*) AS count
    FROM ratings
    WHERE product_id = $1
    GROUP BY rating
    ORDER BY rating DESC;
  `, [productId]);
};


 // Get average rating for a specific product

const getAverageRating = async (productId) => {
   return await db.query('SELECT COALESCE(AVG(rating), 0) AS avg_rating FROM ratings WHERE product_id = $1;', [productId]);
};


 // Add a new rating for a specific product

const addRating = async (productId, rating) => {
  const query = `
    INSERT INTO ratings (id, product_id, rating)
    VALUES (gen_random_uuid(), $1, $2)
    RETURNING *;
  `;
  return db.query(query, [productId, rating]);
};

module.exports = {
  getRatingsDistribution,
  getAverageRating,
  addRating,
};
