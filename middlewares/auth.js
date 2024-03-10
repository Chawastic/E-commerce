const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify token - basically copied from noroff api courase assignment
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ status: 'fail', statuscode: 403, data: { message: 'Token is not valid' } });
            }
            req.userId = decoded.userId;
            next();
        });
    } else {
        res.status(401).json({ status: 'fail', statuscode: 401, data: { message: 'Authorization header not found' } });
    }
};


// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', statuscode: 404, data: { message: 'User not found' } });
        }

        // Check if the user's role_id is 1 (Admin)
        if (user.role_id === 1) {
            next();
        } else {
            res.status(403).json({ status: 'fail', statuscode: 403, data: { message: 'Admin access required' } });
        }
    } catch (error) {
        console.error('isAdmin middleware error:', error);
        res.status(500).json({ status: 'error', statuscode: 500, data: { message: 'Internal server error', error: error.message } });
    }
};

// authenticate front end routes - if not redirect to home page for log in
const ensureAuthenticated = async(req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};

module.exports = {
    verifyToken,
    isAdmin,
    ensureAuthenticated
};
