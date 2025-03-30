const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const History = require('../models/History'); 
const authMiddleware = require('../middleware/authMiddleware');

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle image upload (Store image only, no prediction)
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Save uploaded image path in the database for history tracking
        const imagePath = path.join(__dirname, '..', req.file.path);

        await History.create({
            userId: req.user.id, 
            imagePath: imagePath, 
        });

        res.json({ message: 'Image uploaded successfully', imagePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

module.exports = router;
