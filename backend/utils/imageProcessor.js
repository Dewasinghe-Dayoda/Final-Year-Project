// backend/utils/imageProcessor.js
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp'); // More efficient image processing
const path = require('path');

class SkinDiseaseClassifier {
    constructor() {
        this.model = null;
        this.labels = ['cellulitis', 'impetigo', 'ringworm', 'athletes_foot'];
        this.modelPath = path.join(__dirname, '../ai_models/trained_model/model.json');
        this.loaded = false;
    }

    async loadModel() {
        if (!this.loaded) {
            // Use the CPU backend explicitly for better control
            await tf.setBackend('cpu');
            this.model = await tf.loadGraphModel(`file://${this.modelPath}`);
            this.loaded = true;
            console.log('Model loaded successfully with CPU backend');
        }
    }

    async preprocessImage(imagePath) {
        // Use sharp for efficient image processing
        const buffer = await sharp(imagePath)
            .resize(224, 224)
            .toFormat('jpeg')
            .toBuffer();
        
        const imageTensor = tf.node.decodeImage(buffer, 3);
        return imageTensor.div(255.0).expandDims(0);
    }

    async classify(imagePath) {
        try {
            if (!this.loaded) await this.loadModel();
            
            const processedImage = await this.preprocessImage(imagePath);
            const predictions = this.model.predict(processedImage);
            const results = await predictions.data();
            
            // Dispose tensors to free memory
            processedImage.dispose();
            predictions.dispose();
            
            const confidenceScores = {};
            this.labels.forEach((label, index) => {
                confidenceScores[label] = (results[index] * 100).toFixed(2);
            });
            
            return confidenceScores;
        } catch (error) {
            console.error('Classification error:', error);
            throw error;
        }
    }
}

module.exports = new SkinDiseaseClassifier();