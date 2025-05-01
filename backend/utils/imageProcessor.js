// // backend/utils/imageProcessor.js
// const tf = require('@tensorflow/tfjs-node');
// const sharp = require('sharp'); // More efficient image processing
// const path = require('path');

// class SkinDiseaseClassifier {
//     constructor() {
//         this.model = null;
//         this.labels = ['cellulitis', 'impetigo', 'ringworm', 'athletes_foot'];
//         this.modelPath = path.join(__dirname, '../ai_models/trained_model/model.json');
//         this.loaded = false;
//     }

//     async loadModel() {
//         if (!this.loaded) {
//             // Use the CPU backend explicitly for better control
//             await tf.setBackend('cpu');
//             this.model = await tf.loadGraphModel(`file://${this.modelPath}`);
//             this.loaded = true;
//             console.log('Model loaded successfully with CPU backend');
//         }
//     }

//     async preprocessImage(imagePath) {
//         // Use sharp for efficient image processing
//         const buffer = await sharp(imagePath)
//             .resize(224, 224)
//             .toFormat('jpeg')
//             .toBuffer();
        
//         const imageTensor = tf.node.decodeImage(buffer, 3);
//         return imageTensor.div(255.0).expandDims(0);
//     }

//     async classify(imagePath) {
//         try {
//             if (!this.loaded) await this.loadModel();
            
//             const processedImage = await this.preprocessImage(imagePath);
//             const predictions = this.model.predict(processedImage);
//             const results = await predictions.data();
            
//             // Dispose tensors to free memory
//             processedImage.dispose();
//             predictions.dispose();
            
//             const confidenceScores = {};
//             this.labels.forEach((label, index) => {
//                 confidenceScores[label] = (results[index] * 100).toFixed(2);
//             });
            
//             return confidenceScores;
//         } catch (error) {
//             console.error('Classification error:', error);
//             throw error;
//         }
//     }
// }

// module.exports = new SkinDiseaseClassifier();

import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

function SkinDiseaseClassifier() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const imageRef = useRef();
  const [imageUrl, setImageUrl] = useState('');
  
  // Class names should match your training
  const CLASS_NAMES = ['BA-cellulitis', 'BA-impetigo', 'FU-athlete-foot', 'FU-ringworm'];

  useEffect(() => {
    async function loadModel() {
      try {
        setLoading(true);
        console.log('Loading TensorFlow model...');
        
        // Wait for TensorFlow.js to be ready
        await tf.ready();
        console.log(`TensorFlow initialized with backend: ${tf.getBackend()}`);
        
        // Load the model from public folder
        const model = await loadGraphModel('/skinproscan_224_tfjs_model/model.json');
        setModel(model);
        setError(null);
        console.log('Model loaded successfully');
      } catch (err) {
        console.error('Failed to load model', err);
        setError(`Failed to load model: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadModel();

    // Cleanup function
    return () => {
      if (model) {
        // Dispose of the model when component unmounts
        model.dispose();
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const predict = async () => {
    if (!model || !imageUrl) return;

    try {
      setLoading(true);
      
      // Preprocess the image
      const imageTensor = tf.browser.fromPixels(imageRef.current)
        .resizeNearestNeighbor([224, 224]) // Match model input size
        .toFloat()
        .div(tf.scalar(255.0)) // Normalize
        .expandDims();
      
      // Make prediction
      const predictions = await model.predict(imageTensor).data();
      const results = Array.from(predictions)
        .map((prob, index) => ({
          className: CLASS_NAMES[index],
          probability: (prob * 100).toFixed(2)
        }))
        .sort((a, b) => b.probability - a.probability);
      
      setPredictions(results);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Skin Disease Classifier</h1>
      
      {loading && <p>Loading model...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && (
          <>
            <div style={{margin: '20px 0'}}>
              <img 
                ref={imageRef} 
                src={imageUrl} 
                alt="Uploaded preview" 
                style={{maxWidth: '100%', maxHeight: '300px'}}
                onLoad={predict}
                crossOrigin="anonymous"
              />
            </div>
            <button onClick={predict} disabled={!model || loading}>
              Predict
            </button>
          </>
        )}
      </div>
      
      {predictions && (
        <div style={{marginTop: '20px'}}>
          <h3>Results:</h3>
          <ul>
            {predictions.map((item, i) => (
              <li key={i}>
                {item.className}: {item.probability}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SkinDiseaseClassifier;