const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    glassIntensity: {
        type: Number,
        default: 5,
        min: 1,
        max: 10
    },
    animationsEnabled: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark'
    },
    socialLinks: [{
        platform: String,
        url: String,
        icon: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
