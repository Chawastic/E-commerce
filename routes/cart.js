const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const CartService = require('../services/CartService');
const router = express.Router();
const db = require('../models');
const cartService = new CartService(db);

// Adds a product to the cart
router.post('/', verifyToken, async (req, res) => {
    //#swagger.tags = ['Cart CRUD operations back-end']
    // #swagger.description = "Allows user to add products to cart"
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: "Product ID and quantity are required." }
            });
        }
        const addedItem = await cartService.addToCart(userId, productId, quantity);
        res.status(200).json(addedItem);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error adding to cart', error: error.message }
        });
    }
});

// Allows user to get their products in cart
router.get('/', verifyToken, async (req, res) => {
    //#swagger.tags = ['Cart CRUD operations back-end']
    // #swagger.description = "Allow user to view products in their cart"
    try {
        const userId = req.userId;
        const result = await cartService.getUserCart(userId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            message: error.message
        });
    }
});

// Update the quantity of a cart item
router.put('/item/:orderItemId', verifyToken, async (req, res) => {
    //#swagger.tags = ['Cart CRUD operations back-end']
    // #swagger.description = "Change quantity of items in cart"
    try {
        const { orderItemId } = req.params;
        const { newQuantity } = req.body;
        if (newQuantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0."
            });
        }
        const updatedItem = await cartService.updateCartItemQuantity(orderItemId, newQuantity);
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({
            message: error.message
        });
    }
});

// Delete product from user cart
router.delete('/:productId', verifyToken, async (req, res) => {
    //#swagger.tags = ['Cart CRUD operations back-end']
    // #swagger.description = "Allows user to delete product from their cart"
    try {
        const userId = req.userId;
        const { productId } = req.params;
        await cartService.removeProductFromCart(userId, productId);
        res.json({
            message: 'Product successfully removed from cart.'
        });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({
            message: error.message
        });
    }
});

// Checkout route
router.post('/checkout', verifyToken, async (req, res) => {
    //#swagger.tags = ['Cart CRUD operations back-end']
        // #swagger.description = "User checkout cart - updating status"
    const userId = req.userId;

    try {
        const checkoutResult = await cartService.checkout(userId);
        res.json({
            status: "success",
            statuscode: 200,
            data: checkoutResult
        });
    } catch (error) {
        console.error('Error during checkout:', error.message);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: 'Checkout failed', error: error.message }
        });
    }
});

//allow user to get their discount
router.put('/:orderId/apply-discount', verifyToken, async (req, res) => {
    //#swagger.tags = ['Cart CRUD operations back-end']
    // #swagger.description = "Allows users to get their discount based on membership status"
    const userId = req.userId;
    const { orderId } = req.params;
    try {
        const updatedOrderItems = await cartService.applyDiscountToOrder(userId, orderId);
        res.json({
            status: "success",
            statuscode: 200,
            data: updatedOrderItems
        });
    } catch (error) {
        console.error('Error applying discount:', error.message);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: 'Failed to apply discount', error: error.message }
        });
    }
});

module.exports = router;
