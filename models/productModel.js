const db = require('../db/index.js');

// GET all products
const getAllProducts = async() => {
    return await db.query('SELECT * FROM products');
};

// GET products by name
const getProductByName = async(productname) => {
    return await db.query('SELECT * FROM products WHERE name ILIKE $1', [productname]);
};

// GET product by ID
const getProductById = async(id) => {
    return await db.query('SELECT * FROM products WHERE id = $1', [id])
}

// POST product
const createProduct = async (name, description, price) => {
    return await db.query(
        `INSERT INTO products (name, description, price) 
         VALUES ($1, $2, $3) 
         RETURNING id, created_at, updated_at`,
        [name, description, price]
    );
};

// UPDATE product info and/or price
const updateProduct = async (id, name, description, price) => {
    const updates = [];
    const values = [];
    let counter = 1;

    const fields = [
        { key: 'name', value: name },
        { key: 'description', value: description },
        { key: 'price', value: price }
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
        UPDATE products 
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${counter}
        RETURNING *;
    `;

    return await db.query(query, values);
};

// DELETE product
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

