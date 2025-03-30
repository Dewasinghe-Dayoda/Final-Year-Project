import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

const SkinCheck = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const modelRef = useRef(null); // Store the model persistently

    // Mapping index to disease names (Ensure these match your model classes)
    const diseaseLabels = ["Cellulitis", "Impetigo", "Athlete's Foot", "Ringworm", "Healthy Skin", "Unknown Condition"];

    // Load the model when the component mounts
    useEffect(() => {
        const loadModel = async () => {
            try {
                console.log("Loading model...");
                modelRef.current = await tf.loadLayersModel('/models/model.json');
                console.log("Model loaded successfully!");
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };
        loadModel();
    }, []);

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImageURL(URL.createObjectURL(file)); // Create a temporary URL for preview
            setPrediction(null); // Clear previous predictions
        }
    };

    // Preprocess image before feeding it into the model
    const preprocessImage = async (file) => {
        return new Promise((resolve) => {
            const imgElement = new Image();
            imgElement.src = URL.createObjectURL(file);
            imgElement.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 128;
                canvas.height = 128;
                ctx.drawImage(imgElement, 0, 0, 128, 128);
                
                const tensor = tf.browser.fromPixels(canvas)
                    .resizeBilinear([128, 128]) // Resize to match model input size
                    .div(tf.scalar(255.0)) // Normalize pixel values
                    .expandDims(); // Add batch dimension
                resolve(tensor);
            };
        });
    };

    // Predict disease from uploaded image
    const predictImage = async () => {
        if (!modelRef.current) {
            console.error("Model is not loaded yet.");
            return;
        }
        if (!imageFile) {
            console.error("No image selected.");
            return;
        }
    
        setLoading(true);  // Set loading to true
    
        // Delay the actual processing slightly to allow the UI to update
        setTimeout(async () => {
            try {
                console.log("Preprocessing image...");
                const tensor = await preprocessImage(imageFile);
    
                console.log("Making prediction...");
                const predictions = modelRef.current.predict(tensor);
                const predictedClassIndex = predictions.argMax(1).dataSync()[0];
                const confidence = predictions.max().dataSync()[0];
    
                const detectedDisease = diseaseLabels[predictedClassIndex] || "Unknown";
                setPrediction({ detectedDisease, confidence });
                console.log(`Prediction: ${detectedDisease} (${(confidence * 100).toFixed(2)}%)`);
            } catch (error) {
                console.error("Error in prediction:", error);
            }
    
            setLoading(false);  // Hide "Predicting..." when done
        }, 100); // Small delay (100ms) to ensure UI updates first
    };
    
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Skin Disease Checker</h2>

            {/* Hide the file name */}
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
                id="fileInput"
            />
            <label htmlFor="fileInput" 
                style={{
                    padding: '10px 20px', 
                    background: '#007BFF', 
                    color: 'white', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                }}>
                Choose Image
            </label>

            {/* Show uploaded image */}
            {imageURL && (
                <div>
                    <img src={imageURL} alt="Uploaded" width="200" style={{ marginTop: '10px', borderRadius: '10px' }} />
                </div>
            )}

            {/* Check Disease Button */}
            <button 
                onClick={predictImage} 
                disabled={!imageFile || loading}
                style={{
                    display: 'block', 
                    margin: '15px auto', 
                    padding: '10px 20px', 
                    background: loading ? '#ccc' : '#28a745', 
                    color: 'white', 
                    borderRadius: '5px', 
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? 'Predicting...' : 'Check Disease'}
            </button>

            {/* Show Prediction */}
            {loading && <p style={{ fontSize: '16px', color: 'blue' }}>Predicting...</p>}

            {prediction && (
                <div>
                    <h3>Detected Disease:</h3>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {prediction.detectedDisease}
                    </p>
                    <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
                </div>
            )}
        </div>
    );
};

export default SkinCheck;
