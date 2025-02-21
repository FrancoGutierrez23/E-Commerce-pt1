const db = require('../db/index.js');

const getDetailsForProduct = async (productId) => {
    const result = await db.query( `
        SELECT condition, weight, size, warranty, main_material
        FROM product_details
        WHERE product_id = $1
      `, [productId]);
    return result.rows[0];
};

module.exports = { getDetailsForProduct };
