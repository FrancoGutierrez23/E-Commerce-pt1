const productModel = require('../models/productModel.js');

// POST a new product
const createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || !price) return res.status(400).json({ error: 'All fields are required.' });

    try {
        const result = await productModel.createProduct(name, description, price);
        res.status(201).json({message: 'Product registered successfully!', product: result.rows[0]});
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// UPDATE an existing product
const updateProduct = async (req, res) => {
    const { id, name, description, price } = req.body;
    if (!id) return res.status(400).json({ error: 'Product ID is required for updating.' });

    try {
        const result = await productModel.updateProduct(id, name, description, price);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found.' });

        res.status(200).json({ message: 'Product updated successfully!', product: result.rows[0] });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Product ID is required for deletion.' });

    try {
        const result = await productModel.deleteProduct(id);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found.' });
        res.status(200).json({ message: 'Product deleted successfully!', deletedProduct: result.rows[0] });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct
};
