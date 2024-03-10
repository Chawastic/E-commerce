const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');
const SearchService = require('../services/SearchService');
const db = require('../models');
const searchService = new SearchService(db);

// Product search
router.post('/', verifyToken, async (req, res) => {
    //#swagger.tags = ['Allows for searching products back-end']
        // #swagger.description = "Allows users to search for products"
    try {
        const { searchTerm } = req.body;
        const results = await searchService.searchProducts(searchTerm);
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: {
                items: results,
                count: results.length
            }
        });
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { message: 'Error searching for products', error: error.message }
        });
    }
});

module.exports = router;
