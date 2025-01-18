const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');

router.get('/', homeController.getProducts);

router.get('/:productname', homeController.getProductsByName);



module.exports = router;