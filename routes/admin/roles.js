const express = require('express');
const router = express.Router();
const db = require('../../models');
const { ensureAuthenticated } = require('../../middlewares/auth');


//frontend!
// get and render all roles 
router.get('/', ensureAuthenticated, async (req, res) => {
            //#swagger.tags = ['Get and render roles front-end']
                // #swagger.description = "Gets and renders all roles"
    try {
        const roles = await db.Role.findAll();
        res.render('roles', {
            title: 'Admin roles',
            roles: roles,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).send('Error fetching roles');
    }
});

module.exports = router;
