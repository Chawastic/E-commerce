const express = require('express');
const router = express.Router();
const db = require('../../models');
const { ensureAuthenticated } = require('../../middlewares/auth');

//frontend!
// get all brands
router.get('/', ensureAuthenticated, async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations front-end']
        // #swagger.description = "Render all brands to view"
    try {
        const brands = await db.Brand.findAll();
        res.render('brands', { 
            title: 'Admin Brands',
            brands: brands,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).send('Error fetching brands');
    }
});


// add brands
router.post('/add', async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations front-end']
        // #swagger.description = "Add new brands"
    try {
        const { name } = req.body;
        await db.Brand.create({ name });
        res.json({ message: 'Brand added successfully' });
    } catch (error) {
        console.error('Error adding brand:', error);
        res.status(500).json({ message: 'Error adding brand', error: error.toString() });
    }
});


// delete brands not associated to product
router.delete('/delete/:brandId', async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations front-end']
        // #swagger.description = "Deletes brands not associated to products"
    const { brandId } = req.params;
    try {
        const productCount = await db.Product.count({ where: { brandId: brandId } });
        if (productCount > 0) {
            res.json({ success: false, message: 'Brand cannot be deleted because it has associated products.' });
        } else {
            await db.Brand.destroy({ where: { id: brandId } });
            res.json({ success: true, message: 'Brand deleted successfully.' });
        }
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ success: false, message: 'Error deleting brand.' });
    }
});

// updates any brand
router.post('/update', async (req, res) => {
    //#swagger.tags = ['Brands CRUD operations front-end']
        // #swagger.description = "update any brand"
    const { id, name } = req.body;
    try {
        await db.Brand.update({ name: name }, { where: { id: id } });
        res.json({ success: true, message: 'Brand updated successfully.' });
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ success: false, message: 'Error updating brand.' });
    }
});

module.exports = router;