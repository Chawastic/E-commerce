const express = require('express');
const router = express.Router();
const db = require('../../models');
const { ensureAuthenticated } = require('../../middlewares/auth');

//frontend!
// get all orders
router.get('/', ensureAuthenticated, async (req, res) => {
    //#swagger.tags = ['Orders CRUD operations front-end']
        // #swagger.description = "Gets all orders to view"
    try {
        const orders = await db.Order.findAll();
        res.render('orders', {
            title: 'Admin Orders',
            orders: orders,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
});

// update order status
router.post('/update', async (req, res) => {
        //#swagger.tags = ['Orders CRUD operations front-end']
            // #swagger.description = "Updates order status"
    const { id, status } = req.body;
    try {
        await db.Order.update({ status }, { where: { id } });
        res.json({ success: true, message: 'Order status updated successfully.' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Error updating order status.' });
    }
});

module.exports = router;