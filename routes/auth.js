const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.get('/register', async (req, res) => {
    res.send('register')
});

router.get('/login', async (req, res) => {
    res.send('login')
});

router.get('/logout', async (req, res) => {
    res.send('logout')
});

module.exports = router;