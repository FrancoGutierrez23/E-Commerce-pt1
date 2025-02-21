const express = require('express');
const router = express.Router();
const detailsTableController = require('../controllers/detailsTableController.js');

router.get('/:productId', detailsTableController.getDetailsTable);

module.exports = router;
