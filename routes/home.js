const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.send(result.rows); // Send the first row of the result
    } catch (error) {
        res.status(500).send('Error querying database');
    }
});

router.get('/:productname', async (req, res) => {
    try {
        const productname = req.params.productname.trim(); // Remove any surrounding spaces
        console.log(`Searching for product: ${productname}`);  // Log the product name
        const result = await db.query('SELECT * FROM products WHERE name ILIKE $1', [productname]);

        if (result.rows.length === 0) {
            return res.status(404).send('Product not found');
        }

        res.send(result.rows[0]); // Send the first row of the result
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
});



module.exports = router;