const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');

// Configure multer for file upload (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
    },
    fileFilter: (req, file, cb) => {
        // Accept only PDF, DOC, DOCX
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
        }
    }
});

// @route   POST /api/resume/upload
// @desc    Upload resume
// @access  Private
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Convert buffer to base64 for storage
        const resumeData = {
            name: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            data: req.file.buffer.toString('base64'),
            uploadedAt: new Date()
        };

        // In production, you'd save this to MongoDB or cloud storage (AWS S3, etc.)
        // For now, return the data to be stored in frontend
        res.json({
            success: true,
            message: 'Resume uploaded successfully',
            data: {
                name: resumeData.name,
                size: resumeData.size,
                mimetype: resumeData.mimetype
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading resume',
            error: error.message
        });
    }
});

// @route   GET /api/resume/download
// @desc    Download resume
// @access  Private
router.get('/download', protect, async (req, res) => {
    try {
        // In production, fetch from database and send file
        res.json({
            success: true,
            message: 'Resume download endpoint - implement with your storage solution'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error downloading resume',
            error: error.message
        });
    }
});

module.exports = router;
