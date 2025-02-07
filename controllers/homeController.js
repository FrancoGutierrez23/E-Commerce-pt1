const productModel = require('../models/productModel.js');

// GET prodcts
const getProducts = async (req, res) => {
    try {
        const result = await productModel.getAllProducts();
        res.send(result.rows);
    } catch (error) {
        res.status(500).send('Error querying database');
    }
};

// GET products filtered by name
const getProductsByName = async (req, res) => {
    try {
        const productname = req.params.productname.trim(); // Remove any surrounding spaces
        const result = await productModel.getProductByName(productname);
        if (result.rows.length === 0) return res.status(404).send('Product not found');
        res.send(result.rows[0]);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
};

// GET product by ID
const getProductById = async (req, res) => {
    try {
        const id = req.params.id; // Remove any surrounding spaces
        const result = await productModel.getProductById(id);
        if (result.rows.length === 0) return res.status(404).send('Product not found');
        res.send(result.rows[0]); 
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
}

module.exports = {
    getProducts,
    getProductsByName,
    getProductById
};