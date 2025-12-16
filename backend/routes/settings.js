const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Settings = require('../models/Settings');

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user.id });

        // Create default settings if not exist
        if (!settings) {
            settings = await Settings.create({
                user: req.user.id,
                socialLinks: [
                    { platform: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
                    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin' },
                    { platform: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
                    { platform: 'Email', url: 'mailto:your@email.com', icon: 'fas fa-envelope' }
                ]
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching settings',
            error: error.message
        });
    }
});

// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user.id });

        if (!settings) {
            // Create if doesn't exist
            req.body.user = req.user.id;
            settings = await Settings.create(req.body);
        } else {
            // Update existing
            settings = await Settings.findOneAndUpdate(
                { user: req.user.id },
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating settings',
            error: error.message
        });
    }
});

module.exports = router;
