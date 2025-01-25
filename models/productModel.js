const db = require('../db/index.js');

const getAllProducts = async() => {
    return await db.query('SELECT * FROM products');
};

const getProductByName = async(productname) => {
    return await db.query('SELECT * FROM products WHERE name ILIKE $1', [productname]);
};

const getProductById = async(id) => {
    return await db.query('SELECT * FROM products WHERE id = $1', [id])
}

const createProduct = async (name, description, price) => {
    return await db.query(
        `INSERT INTO products (name, description, price) 
         VALUES ($1, $2, $3) 
         RETURNING id, created_at, updated_at`,
        [name, description, price]
    );
};

const updateProduct = async (id, name, description, price) => {
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
        throw new Error('At least one field must be provided to update.');
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
        UPDATE products 
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${counter}
        RETURNING *;
    `;

    return await db.query(query, values);
};

const deleteProduct = async (id) => {
    return await db.query(
        `DELETE FROM products 
         WHERE id = $1 
         RETURNING *;`,
        [id]
    );
};

module.exports = {
    getAllProducts,
    getProductByName,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
};

