const userModel = require('../models/userModel.js');

// GET a user by ID
const getUserById = async (req, res) => {
    try {
        const tokenUserId = req.user.userId; // The user ID from the verified token
        const requestedUserId = req.params.userId;

        // Ensure the token's user ID matches the requested user ID
        if (tokenUserId !== requestedUserId) return res.status(403).json({ error: 'Unauthorized access to this user profile.' });

        const result = await userModel.getUserById(requestedUserId);
        if (result.rows.length === 0) return res.status(404).json('User not found');
        res.status(200).json(result.rows[0]); // Send the found user
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json('Error querying database');
    }
};

// Update user information
const updateUser = async (req, res) => {
    const { id, username, email, password } = req.body;
    if (!id) return res.status(400).json({ error: 'User ID is required for updating.' });

    try {
        const result = await userModel.updateUser(id, username, email, password);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
        res.status(200).json({ message: 'User updated successfully!', user: result.rows[0] });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

module.exports = {
    getUserById,
    updateUser
};
