const db = require('../db/index.js');

// GET a single user by ID
const getUserById = async (userId) => {
    return await db.query('SELECT * FROM users WHERE id = $1', [userId]);
};

// UPDATE user information
const updateUser = async (id, username, email, password) => {
    const updates = [];
    const values = [];
    let counter = 1;

    const fields = [
        { key: 'username', value: username },
        { key: 'email', value: email },
        { key: 'password', value: password }
    ];
    
    fields.forEach(({ key, value }) => {
        if (value !== undefined) {
            updates.push(`${key} = $${counter++}`);
            values.push(value);
        }
    });
    
    if (updates.length === 0) throw new Error('At least one field must be provided to update.');    

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
