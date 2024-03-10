const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const ProductService = require('../services/ProductService');
const db = require('../models');
const productService = new ProductService(db);

// Get endpoint for fetching all products
router.get('/', async (req, res) => {
    //#swagger.tags = ['Products CRUD operations back-end']
        // #swagger.description = "Allows anybody to get all products"
    try {
        const products = await productService.getAllProducts();
        if (products.length > 0) {
            res.status(200).json({
                status: "success",
                statuscode: 200,
                data: { products: products }
            });
        } else {
            res.status(404).json({
                status: "error",
                statuscode: 404,
                data: { result: "No products found" }
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error fetching products', error: error.message }
        });
    }
});

// Admin post products
router.post('/', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Products CRUD operations back-end']
        // #swagger.description = "Allows admin to add new products"
    try {
        const newProduct = await productService.addProduct(req.body);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { newProduct: newProduct }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error fetching product', error: error.message }
        });
    }
});

// Admin change product - patch instead of put so we don't replace the entire product
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Products CRUD operations back-end']
        // #swagger.description = "Allows admin to update and change a product"
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (updatedProduct) {
            res.status(200).json({
                status: "success",
                statuscode: 200,
                data: { updatedProduct: updatedProduct }
            });
        } else {
            res.status(404).json({ 
                status: 'error',
                statuscode: 404,
                data: { message: 'Product not found' }
            });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            status: 'error',
            statuscode: 500,
            data: { message: 'Error updating product', error: error.message }
        });
    }
});

// Soft-deleting product
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Products CRUD operations back-end']
        // #swagger.description = "Allows admin to soft-delete products"
    try {
        const numberOfAffectedRows = await productService.softDeleteProduct(req.params.id);
        if (numberOfAffectedRows > 0) {
            res.status(200).json({
                status: "success",
                statuscode: 200,
                data: { message: 'Product soft deleted successfully' }
            });
        } else {
            res.status(404).json({
                status: "error",
                statuscode: 404,
                data: { message: 'Product not found' }
            });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: 'Error deleting product', error: error.message }
        });
    }
});

module.exports = router;
