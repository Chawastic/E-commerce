const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const CategoryService = require('../services/CategoryService');
const router = express.Router();
const db = require('../models');
const categoryService = new CategoryService(db);

// Post endpoint creating a new category
router.post('/', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Categories CRUD operations back-end']
        // #swagger.description = "Allow admin to post new categories"
    try {
        const newCategory = await categoryService.addCategory(req.body);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: "Category added successfully", category: newCategory }
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error adding category', error: error.message }
        });
    }
});

// get all categories
router.get('/', async (req, res) => {
    //#swagger.tags = ['Categories CRUD operations back-end']
        // #swagger.description = "Allows anyone to view available categories"
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { categories: categories }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error fetching categories', error: error.message }
        });
    }
});


//update categories
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Categories CRUD operations back-end']
        // #swagger.description = "Allows admin to update category names"
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        if (updatedCategory) {
            res.status(200).json({
                status: "success",
                statuscode: 200,
                data: { updatedCategory }
            });
        } else {
            res.status(404).json({
                status: "error",
                statuscode: 404,
                data: { result: 'Category not found' }
            });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error updating category', error: error.message }
        });
    }
});


// delete categories as long as not associated to product
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Categories CRUD operations back-end']
        // #swagger.description = "Allows admin to delete categories not associated to products"
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: result
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        if (error.message === 'Category not found') {
            res.status(404).json({
                status: "error",
                statuscode: 404,
                data: { result: 'Category not found' }
            });
        } else if (error.message === 'Category cannot be deleted as it has associated products') {
            res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: 'Category cannot be deleted as it has associated products' }
            });
        } else {
            res.status(500).json({
                status: "error",
                statuscode: 500,
                data: { result: 'Error deleting category', error: error.message }
            });
        }
    }
});

module.exports = router;
