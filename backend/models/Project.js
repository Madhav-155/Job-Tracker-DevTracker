const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    techStack: String,
    link: String,
    imageUrl: String,
    isJobRelated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
ProjectSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Project', ProjectSchema);
