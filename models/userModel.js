const db = require('../db/index.js');

// Get a single user by ID
const getUserById = async (userId) => {
    return await db.query('SELECT * FROM users WHERE id = $1', [userId]);
};

// Update user information
const updateUser = async (id, username, email, password) => {
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
        throw new Error('At least one field must be provided to update.');
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${counter}
        RETURNING *;
    `;

    return await db.query(query, values);
};

module.exports = {
    getUserById,
    updateUser
};
