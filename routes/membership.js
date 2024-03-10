const express = require('express');
const { isAdmin, verifyToken } = require('../middlewares/auth');
const MembershipService = require('../services/MembershipService');
const router = express.Router();
const db = require('../models');
const membershipService = new MembershipService(db);

// Get all memberships (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Membership CRUD operations back-end']
        // #swagger.description = "Allows admin to get and view all memberships"
    try {
        const memberships = await membershipService.getAllMemberships();
        res.json({
            status: "success",
            statuscode: 200,
            data: memberships
        });
    } catch (error) {
        console.error('Error fetching memberships:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            message: error.message
        });
    }
});

// Post endpoint for creating a new membership (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Membership CRUD operations back-end']
        // #swagger.description = "Allows admin to create new memberships"
    try {
        const newMembership = await membershipService.addMembership(req.body);
        res.json({
            status: "success",
            statuscode: 200,
            data: newMembership
        });
    } catch (error) {
        console.error('Error adding membership:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            message: error.message
        });
    }
});

// Patch endpoint for updating a membership (Admin only)
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Membership CRUD operations back-end']
        // #swagger.description = "Allows admin to update memberships"
    try {
        const updatedMembership = await membershipService.updateMembership(req.params.id, req.body);
        res.json({
            status: "success",
            statuscode: 200,
            data: updatedMembership
        });
    } catch (error) {
        console.error('Error updating membership:', error);
        res.status(500).json({
            status: "error",
            statuscode: 500,
            message: error.message
        });
    }
});

//delete memberships as long as their not assigned to a user
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    //#swagger.tags = ['Membership CRUD operations back-end']
        // #swagger.description = "Ability for admin to delete membership roles not assigned to any users"
    try {
        const result = await membershipService.deleteMembership(req.params.id);
        res.json({
            status: "success",
            statuscode: 200,
            data: result
        });
    } catch (error) {
        console.error('Error deleting membership:', error);
        let statusCode = 500;
        let errorMessage = error.message;
        if (error.message.includes('currently assigned to users')) {
            statusCode = 400;
            errorMessage = error.message;
        }
        res.status(statusCode).json({
            status: "error",
            statuscode: statusCode,
            message: errorMessage
        });
    }
});

module.exports = router;
