const express = require('express');
const multer = require('multer');
const router = express.Router();
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs'); // Add this to read files
const History = require('../models/History'); // Import the History model
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// Load your TensorFlow.js model
let model;
const loadModel = async () => {
    model = await tf.loadLayersModel('D:/SE final year/final project individual/Final year project/skin_disease_awareness_website/Skin_Pro/skin-disease-project/trained_model/tfjs_model/model.json'); // Update the path to your model
};
loadModel();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle image upload and prediction
router.post('/predict', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Load and preprocess the image
        const imagePath = path.join(__dirname, '..', req.file.path);
        const image = await tf.node.decodeImage(fs.readFileSync(imagePath), 3); // Read and decode the image
        const resizedImage = tf.image.resizeBilinear(image, [224, 224]); // Resize to match model input size
        const normalizedImage = resizedImage.div(255.0).expandDims(); // Normalize and add batch dimension

        // Make a prediction
        const predictions = await model.predict(normalizedImage);
        const predictedClass = predictions.argMax(1).dataSync()[0]; // Get predicted class
        const confidence = predictions.max().dataSync()[0]; // Get confidence score

        // Save prediction to history
        await History.create({
            userId: req.user.id, // Save the user ID from the authenticated request
            imagePath: req.file.path, // Save the path to the uploaded image
            prediction: predictedClass, // Save the predicted class
            confidence: confidence, // Save the confidence score
        });

        // Send the prediction result
        res.json({ predictedClass, confidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Prediction failed' });
    }
});

module.exports = router;