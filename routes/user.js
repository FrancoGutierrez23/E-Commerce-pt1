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

module.exports = router;
