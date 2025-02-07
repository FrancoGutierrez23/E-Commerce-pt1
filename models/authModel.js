const db = require('../db/index.js');

//POST new user
const createUser = async (username, email, hashedPassword) => {
    return await db.query(
        `INSERT INTO users (username, email, password) 
         VALUES ($1, $2, $3) 
         RETURNING id, username, email`,
        [username, email, hashedPassword]
    );
};

// GET user by username
const getUserByUsername = async (username) => {
    return await db.query('SELECT * FROM users WHERE username = $1', [username]);
};

//GET user by ID
const getUserById = async (id) => {
    return await db.query('SELECT * FROM users WHERE id = $1', [id]);
};

module.exports = {
    createUser,
    getUserByUsername,
    getUserById
};