const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController.js');

// GET rating distribution and average rating for a product
router.get('/:productId', ratingsController.getRatings);

// POST a new rating
router.post('/', ratingsController.createRating);

module.exports = router;