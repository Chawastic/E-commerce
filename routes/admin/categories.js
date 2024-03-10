const express = require('express');
const router = express.Router();
const db = require('../../models');
const { ensureAuthenticated } = require('../../middlewares/auth');

//frontend!
// get all categories to front end
router.get('/', ensureAuthenticated, async (req, res) => {
    //#swagger.tags = ['Categories CRUD operations front-end']
        // #swagger.description = "Renders all categories to view"
    try {
        const categories = await db.Category.findAll();
        res.render('categories', { 
            title: 'Admin Categories',
            categories: categories,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories');
    }
});

// add categories to database
router.post('/add', async (req, res) => {
        //#swagger.tags = ['Categories CRUD operations front-end']
            // #swagger.description = "Allows to add categories new to database"
    const { name } = req.body;
    try {
        await db.Category.create({ name });
        res.json({ message: 'Category added successfully' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error adding category' });
    }
});

// delete any categories, wont delete ones associated to products
router.delete('/delete/:categoryId', async (req, res) => {
        //#swagger.tags = ['Categories CRUD operations front-end']
            // #swagger.description = "Delete any category not associated to products"
    const { categoryId } = req.params;
    try {
        const productCount = await db.Product.count({ where: { categoryId: categoryId } });
        if (productCount > 0) {
            res.json({ success: false, message: 'Category cannot be deleted because it is associated with one or more products.' });
        } else {
            await db.Category.destroy({ where: { id: categoryId } });
            res.json({ success: true, message: 'Category deleted successfully.' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Error deleting category.' });
    }
});


// updates any categories
router.post('/update', async (req, res) => {
        //#swagger.tags = ['Categories CRUD operations front-end']
            // #swagger.description = "Allows to update any category"
    const { id, name } = req.body;
    try {
        await db.Category.update({ name: name }, { where: { id: id } });
        res.json({ success: true, message: 'Category updated successfully.' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Error updating category.' });
    }
});

module.exports = router;
