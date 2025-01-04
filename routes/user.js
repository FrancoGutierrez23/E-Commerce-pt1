const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.send(result.rows[0]); // Send the first row of the result
    } catch (error) {
        res.status(500).send('Error querying database');
    }
});

router.get('/:userId', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).send('Product not found');
        };

        res.send(result.rows[0]);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying database');
    }
});

router.put('/:userId', async (req, res) => {
    const {id, username, email, password} = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required for updating.' });
    }

    // Construct the SQL dynamically
    const updates = [];
    const values = [];
    let counter = 1;

    if (username) {
        updates.push(`username = $${counter++}`);
        values.push(username);
    }
    if (email) {
        updates.push(`email = $${counter++}`);
        values.push(email);
    }
    if (password) {
        updates.push(`password = $${counter++}`);
        values.push(password);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'At least one field must be provided to update.' });
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${counter}
        RETURNING *;
    `;
    try {
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({
            message: 'User updated successfully!',
            User: result.rows[0],
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
})

module.exports = router;
