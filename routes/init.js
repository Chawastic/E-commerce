const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');

// Import the models
const { Brand, Category, Product, Role, User, Membership} = require('../models');

const router = express.Router();

// Initialize database
router.post('/', async (req, res) => {
    //#swagger.tags = ['INITIALIZE DATABASE with data']
    // #swagger.description = "Necessary to initialize databse with some data"
    try {
        // Make sure database is empty - so we dont double insert
        const productCount = await Product.count();
        const userCount = await User.count();
        if (productCount > 0 || userCount > 0) {
            return res.status(409).json({
                status: "fail",
                statuscode: 409,
                data: { result: 'Database is already initialized.' }
            });
        }

        // create roles
        await Role.bulkCreate([
            { id: 1, name: 'Admin' },
            { id: 2, name: 'User' },
        ]);

        // create memberships
        await Membership.bulkCreate([
            { name: 'Bronze', discount_rate: 0, min_purchases: 0 },
            { name: 'Silver', discount_rate: 15, min_purchases: 15 },
            { name: 'Gold', discount_rate: 30, min_purchases: 30 },
        ]);

        // Create admin user with hashed password using bcrypt
        const hashedPassword = await bcrypt.hash('P@ssword2023', 10);
        await User.create({
            username: 'Admin',
            password: hashedPassword,
            email: 'admin@noroff.no',
            firstname: 'Admin',
            lastname: 'Support',
            address: 'Online',
            telephonenumber: '911',
            role_id: 1,
        });

        // get data from API provided from moddle
        const response = await axios.get('http://backend.restapi.co.za/items/products');
        const productsData = response.data.data;
        for (const item of productsData) {
            const [brand] = await Brand.findOrCreate({
                where: { name: item.brand }
            });
            const [category] = await Category.findOrCreate({
                where: { name: item.category }
            });
            await Product.create({
                name: item.name,
                description: item.description,
                price: item.price,
                stockQuantity: item.quantity,
                brandId: brand.id,
                categoryId: category.id
            });
        }
        res.status(200).json({
            status: "success",
            statuscode: 200,
            data: { result: 'Database initialized successfully.' }
        });
    } catch (error) {
        console.error('Error initializing the database:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            data: { result: 'Error initializing the database', error: error.message }
        });
    }
});

module.exports = router;
