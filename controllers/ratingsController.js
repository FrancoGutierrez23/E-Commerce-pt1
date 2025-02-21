const ratingsModel = require('../models/ratingsModel.js');
  
  /**
   * Controller to get rating distribution + average rating for a product
   */
  const getRatings = async (req, res) => {
    const { productId } = req.params;
  
    try {
      // Get distribution of ratings
      const distributionResult = await ratingsModel.getRatingsDistribution(productId);
      // Get average rating
      const averageResult = await ratingsModel.getAverageRating(productId);
  
      res.status(200).json({
        distribution: distributionResult.rows,
        average: averageResult.rows[0]?.avg_rating || 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving ratings' });
    }
  };
  
  /**
   * Controller to add a new rating
   */
  const createRating = async (req, res) => {
    const { productId, rating } = req.body;
  
    // Validate rating
    if (![1, 2, 3, 4, 5].includes(rating)) {
      return res.status(400).json({ error: 'Invalid rating value' });
    }
  
    try {
      const newRating = await ratingsModel.addRating(productId, rating);
      res.status(201).json({ rating: newRating.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating rating' });
    }
  };
  
  module.exports = {
    getRatings,
    createRating,
  };
  