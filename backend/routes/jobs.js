const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Job = require('../models/Job');

// @route   GET /api/jobs
// @desc    Get all jobs for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort({ appliedDate: -1 });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Make sure user owns job
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        req.body.user = req.user.id;
        
        const job = await Job.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Make sure user owns job
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            message: 'Job updated successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Make sure user owns job
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await job.deleteOne();

        res.json({
            success: true,
            message: 'Job deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
});

// @route   POST /api/jobs/bulk
// @desc    Create multiple jobs (for import)
// @access  Private
router.post('/bulk', protect, async (req, res) => {
    try {
        const jobs = req.body.jobs.map(job => ({
            ...job,
            user: req.user.id
        }));

        const createdJobs = await Job.insertMany(jobs);

        res.status(201).json({
            success: true,
            message: `${createdJobs.length} jobs imported successfully`,
            count: createdJobs.length,
            data: createdJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error importing jobs',
            error: error.message
        });
    }
});

module.exports = router;
