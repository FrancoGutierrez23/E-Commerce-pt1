const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const authenticateToken = require('./helpers.js');

// Apply middleware to all routes in this file
router.use(authenticateToken);


router.post('/', async (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Insert the product into the database
        const result = await db.query(
            `INSERT INTO products (name, description, price) 
             VALUES ($1, $2, $3) 
             RETURNING id, created_at, updated_at`,
            [name, description, price]
        );

        res.status(201).json({
            message: 'Product registered successfully!',
            product: result.rows[0],
        });
    } catch (error) {
            res.status(500).json({ error: 'Server error. Please try again.' });
    }
});


router.put('/', async (req, res) => {
    const { id, name, description, price } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required for updating.' });
    }

    // Construct the SQL dynamically
    const updates = [];
    const values = [];
    let counter = 1;

    if (name) {
        updates.push(`name = $${counter++}`);
        values.push(name);
    }
    if (description) {
        updates.push(`description = $${counter++}`);
        values.push(description);
    }
    if (price) {
        updates.push(`price = $${counter++}`);
        values.push(price);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'At least one field must be provided to update.' });
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
        UPDATE products 
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${counter}
        RETURNING *;
    `;

    try {
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.status(200).json({
            message: 'Product updated successfully!',
            product: result.rows[0],
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});


router.delete('/', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required for deletion.' });
    }

    try {
        const result = await db.query(
            `DELETE FROM products 
             WHERE id = $1 
             RETURNING *;`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.status(200).json({
            message: 'Product deleted successfully!',
            deletedProduct: result.rows[0], // Return the deleted product's info for confirmation
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});


module.exports = router;