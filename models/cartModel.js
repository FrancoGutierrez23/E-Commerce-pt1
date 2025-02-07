const db = require('../db/index.js');

// GET all cart items
const getCartItems = async (userId) => {
    return await db.query('SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)', [userId]);
};

// POST new item to user's cart
const addItemToCart = async (userId, productId, quantity, price) => {
    const checkForCart = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = checkForCart.rows[0] ? checkForCart.rows[0].id : (await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId])).rows[0].id;
    
    await db.query('INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [cartId, productId, quantity, price]);

    await db.query('UPDATE carts SET cart_total = cart_total + $1 WHERE user_id = $2', [quantity*price, userId]);

    return db.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
};

// UPDATE quantity of certain cart item
const updateItemQuantity = async (userId, quantity, productId, price) => {
    // Get current quantity to calculate the old total for that product
    const currentItem = await db.query(
        'SELECT quantity FROM cart_items WHERE product_id = $1 AND cart_id = (SELECT id FROM carts WHERE user_id = $2)', 
        [productId, userId]
    );
    
    const oldQuantity = currentItem.rows[0]?.quantity;
    if (oldQuantity !== undefined) {
        // Calculate old and new totals
        const oldTotal = oldQuantity * price;
        const newTotal = quantity * price;
        // Update the cart's total by subtracting the old total and adding the new total
        await db.query('UPDATE carts SET cart_total = cart_total - $1 + $2 WHERE user_id = $3', [oldTotal, newTotal, userId]);
        // Now update the cart item's quantity
        return await db.query('UPDATE cart_items SET quantity = $1 WHERE product_id = $2 AND cart_id = (SELECT id FROM carts WHERE user_id = $3)', [quantity, productId, userId]);
    } else {
        throw new Error('Item not found in the cart');
    }
};

// DELETE a cart item
const deleteCartItem = async (cartItemId, quantity, price) => {
    const totalPriceDeletedItem = quantity * price;
    // Update the cart total to remove the deleted item's price
    await db.query('UPDATE carts SET cart_total = cart_total - $1 WHERE id = (SELECT cart_id FROM cart_items WHERE id = $2)', [totalPriceDeletedItem, cartItemId]);
    // Delete the item from the cart_items table
    return await db.query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [cartItemId]);
};

// Checkout user's cart
const checkoutCart = async (cartId, userId) => {
    const cartItemsResult = await db.query('SELECT ci.product_id, ci.quantity, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1', [cartId]);
    const cartItems = cartItemsResult.rows;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderResult = await db.query('INSERT INTO orders (user_id, status, total_price) VALUES ($1, $2, $3) RETURNING id', [userId, 'Pending', totalPrice]);
    const orderId = orderResult.rows[0].id;

    const orderItemsQueries = cartItems.map(item => 
        db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', 
            [orderId, item.product_id, item.quantity, item.price])
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
