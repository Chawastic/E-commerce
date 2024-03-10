const express = require('express');
const router = express.Router();
const db = require('../../models');
const { ensureAuthenticated } = require('../../middlewares/auth');


//frontend!
// Get and render all users
router.get('/', ensureAuthenticated, async (req, res) => {
            //#swagger.tags = ['Users CRUD operations front-end']
                // #swagger.description = "Gets abd renders all users"
    try {
        // gets all users and their roles + memberships
        const users = await db.User.findAll({
            include: [
                { model: db.Role },
                { model: db.Membership }
            ]
        });
        const roles = await db.Role.findAll();
        res.render('users', {
            title: 'Admin Users',
            users: users,
            roles: roles,
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching users or roles:', error);
        res.status(500).send('Error fetching data');
    }
});

// front-end post route to update users info
router.post('/update', async (req, res) => {
                //#swagger.tags = ['Users CRUD operations front-end']
                    // #swagger.description = "Allows admin to update information regarding users"
    const { id, firstname, lastname, email, roleId } = req.body;
    try {
        //first finds user by primary key
        const user = await db.User.findByPk(id);
        if (!user) {
            //catch if user doesnt exist
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        //if user exists updates this info
        await user.update({
            firstname,
            lastname,
            email,
            roleId,
        });
        res.json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user.' });
    }
});

module.exports = router;
