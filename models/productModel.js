const db = require('../db/index.js');

const getAllProducts = async() => {
    return await db.query('SELECT * FROM products');
};

const getProductByName = async(productname) => {
    return await db.query('SELECT * FROM products WHERE name ILIKE $1', [productname]);
};

module.exports = {
    getAllProducts,
    getProductByName
};