const express = require('express');
const router = express.Router();
const db = require('../../models');
const { Op } = require('sequelize');
const { ensureAuthenticated } = require('../../middlewares/auth');

//frontend!
//get and render all products from DB to front end
router.get('/', ensureAuthenticated, async (req, res) => {
        //#swagger.tags = ['Procucts CRUD operations front-end']
            // #swagger.description = "Renders all products from database"
    let whereCondition = {};
    if (req.query.search) {
        whereCondition.name = {
            [Op.like]: `%${req.query.search}%`
        };
    }
    if (req.query.brand) {
        whereCondition.brandId = req.query.brand;
    }
    if (req.query.category) {
        whereCondition.categoryId = req.query.category;
    }
    try {
        // get products based off conditions
        const products = await db.Product.findAll({
            where: whereCondition,
            include: [
                { model: db.Brand, as: 'Brand', attributes: ['id', 'name'] },
                { model: db.Category, as: 'Category', attributes: ['id', 'name'] }
            ]
        });
        //get all brands and categories to filter
        const brands = await db.Brand.findAll({ attributes: ['id', 'name'] });
        const categories = await db.Category.findAll({ attributes: ['id', 'name'] });
        //renders products that have been feteched
        res.render('products', { 
            title: 'Admin Products',
            products: products,
            brands: brands,
            categories: categories,
            search: req.query.search || '',
            selectedBrand: req.query.brand || '',
            selectedCategory: req.query.category || '',
            message: products.length > 0 ? '' : 'No products found',
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).render('error', {
            message: 'Error fetching data',
            error: error.message
        });
    }
});


// route associated to edit btn - updated any products and sends to database
router.post('/update', async (req, res) => {
            //#swagger.tags = ['Procucts CRUD operations front-end']
                // #swagger.description = "Update any products information"
    const { id, name, brandId, categoryId, description, stockQuantity, price, isActive } = req.body;
    try {
        await db.Product.update({ 
            name, 
            brandId, 
            categoryId, 
            description, 
            stockQuantity,
            price,
            isActive
        }, { where: { id } });
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error });
    }
});

module.exports = router;
