const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role/title is required'],
        trim: true
    },
    appliedDate: {
        type: String,
        required: [true, 'Applied date is required']
    },
    status: {
        type: String,
        required: true,
        enum: ['Applied', 'Phone', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied'
    },
    stage: String,
    source: String,
    applicationUrl: String,
    location: String,
    salary: String,
    contactPerson: String,
    contactEmail: String,
    notes: String,
    tags: String,
    nextActionDate: String,
    resume: {
        name: String,
        size: Number,
        attached: Boolean
    }
}, {
    timestamps: true
});

// Index for faster queries
JobSchema.index({ user: 1, appliedDate: -1 });
JobSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Job', JobSchema);
