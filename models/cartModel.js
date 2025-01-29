const db = require('../db/index.js');

const getCartItems = async (userId) => {
    return await db.query('SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)', [userId]);
};

const addItemToCart = async (userId, productId, quantity, price) => {
    const checkForCart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = checkForCart.rows[0] ? checkForCart.rows[0].id : (await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId])).rows[0].id;
    
    await db.query('INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [cartId, productId, quantity, price]);

    await db.query('UPDATE carts SET cart_total = cart_total + $1 WHERE user_id = $2', [quantity*price, userId]);

    return db.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
};

const updateItemQuantity = async (userId, quantity, productId) => {
    return await db.query('UPDATE cart_items SET quantity = $1 WHERE product_id = $2 AND cart_id = (SELECT id FROM carts WHERE user_id = $3)', [quantity, productId, userId]);
};

const deleteCartItem = async (cartItemId) => {
    return await db.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [cartItemId]);
};

const checkoutCart = async (cartId, userId) => {
    const cartItemsResult = await db.query('SELECT ci.product_id, ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1', [cartId]);
    const cartItems = cartItemsResult.rows;

    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderResult = await db.query('INSERT INTO orders (user_id, status, total_price) VALUES ($1, $2, $3) RETURNING id', [userId, 'Pending', totalPrice]);
    const orderId = orderResult.rows[0].id;

    const orderItemsQueries = cartItems.map(item => 
        db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.product_id, item.quantity, item.price])
    );
    await Promise.all(orderItemsQueries);

    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    await db.query('DELETE FROM carts WHERE id = $1', [cartId]);

    return { orderId, cartItems };
};

module.exports = {
    getCartItems,
    addItemToCart,
    updateItemQuantity,
    deleteCartItem,
    checkoutCart
};
