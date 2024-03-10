const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const BrandService = require('../services/BrandService');
const router = express.Router();
const db = require('../models');
const brandService = new BrandService(db);

// Post endpoint for creating a new brand
router.post('/', verifyToken, isAdmin, async (req, res) => {
     //#swagger.tags = ['Brands CRUD operations back-end']
    // #swagger.description = "Allows for admin to create new brands"
    try {
        const newBrand = await brandService.addBrand(req.body);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: "Brand added successfully", brand: newBrand }
        });
    } catch (error) {
        console.error('Error adding brand:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error adding brand', error: error.message }
        });
    }
});

// Get endpoint for retrieving all brands
router.get('/', async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations back-end']
        // #swagger.description = "allows for anyone to get and view available brands"
    try {
        const brands = await brandService.getBrands();
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { brands: brands }
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error fetching brands', error: error.message }
        });
    }
});

// Patch endpoint for updating a brand by ID
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations back-end']
        // #swagger.description = "Admin can update brand name"
    try {
        const updatedBrand = await brandService.updateBrand(req.params.id, req.body);
        if (updatedBrand) {
            res.status(200).json({
                status: "success",
                statuscode: 200,
                data: { updatedBrand }
            });
        } else {
            res.status(404).json({
                status: "error",
                statuscode: 404,
                data: { result: 'Brand not found' }
            });
        }
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error updating brand', error: error.message }
        });
    }
});

// Delete endpoint for deleting a brand by ID
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations back-end']
        // #swagger.description = "Admin can delete brand aslon as not associated to products"
    try {
        const result = await brandService.deleteBrand(req.params.id);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: result
        });
    } catch (error) {
        console.error('Error deleting brand:', error);
        if (error.message === 'Brand not found') {
            res.status(404).json({
                status: "error",
                statuscode: 404,
                data: { result: 'Brand not found' }
            });
        } else if (error.message === 'Brand cannot be deleted as it has associated products') {
            res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: 'Brand cannot be deleted as it has associated products' }
            });
        } else {
            res.status(500).json({
                status: "error",
                statuscode: 500,
                data: { result: 'Error deleting brand', error: error.message }
            });
        }
    }
});

module.exports = router;
