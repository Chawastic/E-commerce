const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../../passport-config');

// login route
router.post('/login', passport.authenticate('local', {
     //#swagger.tags = ['Log-in/Register front-end api´s']
         // #swagger.description = "So only Admins can access front-end, log in"
    successRedirect: '/admin/products',
    failureRedirect: '/',
    failureFlash: true
}));

// logout route
router.get('/logout', (req, res, next) => {
     //#swagger.tags = ['Log-in/Register front-end api´s']
         // #swagger.description = "Allows for log out functionality"
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

module.exports = router;