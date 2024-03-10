const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { Op } = require('sequelize');
const { User } = require('../models');

// secret key variable
const JWT_SECRET = process.env.JWT_SECRET;

// Get validation
const { validateEmail } = require('../public/javascripts/validation');

// Registration endpoint
router.post('/register', async (req, res) => {
//#swagger.tags = ['Log-in/Register back-end api´s']
    // #swagger.description = "Allows to register to application"
    try {
        const { firstname, lastname, username, email, password, address, telephonenumber } = req.body;
        // if any informations missing this should stop it from going through
        if (!firstname || !lastname || !username || !email || !password || !address || !telephonenumber) {
            return res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: 'All fields are required' }
            });
        }
        //email validation found in public/javascripts/validation.js - incase they enter wronlgy formatted email adress
        if (!validateEmail(email)) {
            return res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: 'Invalid email format.' }
            });
        }
        // if users tries to register using a email or username that already exists - will send this error
        const existingUser = await User.findOne({ where: { email } }) || await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                statuscode: 400,
                data: { result: 'Username or email already in use' }
            });
        }
        //get password hasching
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,//use hasching for password here.
            address,
            telephonenumber,
            role_id: 2,
            membership_id: 1
        });
        res.status(201).json({
            status: "success",
            statuscode: 201,
            data: {
                result: "You created an account.",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error registering new user', error: error.message }
        });
    }
});


// post login route
router.post('/login', async (req, res) => {
    //#swagger.tags = ['Log-in/Register back-end api´s']
        // #swagger.description = "Allow for user/admin log-in"
    const { login, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
              //allow for email or username login
                [Op.or]: [{ email: login }, { username: login }]
            }
        });
        //if user cant be found
        if (!user) {
            return res.status(401).json({
                status: "error",
                statuscode: 401,
                data: { result: 'Login failed. User not found.' }
            });
        }
        const match = await bcrypt.compare(password, user.password);//compare password with encrypted password
        if (!match) {
            return res.status(401).json({
                status: "error",
                statuscode: 401,
                data: { result: 'Login failed. Incorrect password.' }
            });
        }
        //json web token req, lasts 2 hours as called for
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '2h' }
        );
        res.json({
            status: "success",
            statuscode: 200,
            data: {
                result: "You are logged in",
                id: user.id,
                email: user.email,
                username: user.username,
                token: token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error logging in', error: error.message }
        });
    }
});

module.exports = router;
