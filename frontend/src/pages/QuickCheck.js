// import React, { useState } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import api from '../api'; // Import the API utility

// const QuickCheck = () => {
//     const [image, setImage] = useState(null);
//     const [prediction, setPrediction] = useState(null);
//     const [loading, setLoading] = useState(false); // Add loading state

//     // Load the TensorFlow.js model
//     const loadModel = async () => {
//         const model = await tf.loadLayersModel('D:/SE final year/final project individual/Final year project/skin_disease_awareness_website/Skin_Pro/skin-disease-project/trained_model/tfjs_model/model.json');
//         return model;
//     };

//     // Handle image upload and prediction
//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setLoading(true); // Set loading to true

//         try {
//             // Option 1: Use TensorFlow.js for prediction (client-side)
//             const img = new Image();
//             img.src = URL.createObjectURL(file);
//             img.onload = async () => {
//                 const tensor = tf.browser
//                     .fromPixels(img)
//                     .resizeNearestNeighbor([224, 224]) // Resize to match model input size
//                     .toFloat()
//                     .expandDims(); // Add batch dimension

//                 const model = await loadModel(); // Load the model
//                 const predictions = await model.predict(tensor); // Make prediction
//                 const predictedClass = predictions.argMax(1).dataSync()[0]; // Get predicted class
//                 const confidence = predictions.max().dataSync()[0]; // Get confidence

//                 setPrediction({ predictedClass, confidence }); // Update prediction state
//                 setLoading(false); // Set loading to false
//             };

//             // Option 2: Use backend API for prediction (server-side)
//             /*
//             const formData = new FormData();
//             formData.append('image', file);

//             const res = await api.post('/api/predict', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             setPrediction(res.data); // Update prediction state
//             setLoading(false); // Set loading to false
//             */
//         } catch (error) {
//             console.error(error);
//             alert('Failed to process image');
//             setLoading(false); // Set loading to false
//         }
//     };

//     return (
//         <div className="quick-check">
//             <h2>Quick Check</h2>
//             <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
//             {loading && <p>Processing image...</p>}
//             {prediction && (
//                 <div>
//                     <p>Predicted Class: {prediction.predictedClass}</p>
//                     <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QuickCheck;
import React, { useState } from "react";
import "../styles/QuickCheck.css";
import uploadIcon from "../assets/upload-icon.png"; // Example image path

const QuickCheck = () => {
  const [image, setImage] = useState(null);
  const [symptoms, setSymptoms] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic for image and symptom submission
  };

  return (
    <div className="quick-check-container">
      <h1>Quick Check</h1>
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <label htmlFor="image-upload">
            <img src={uploadIcon} alt="Upload" />
            <p><strong><u>Upload an image of your skin condition</u></strong></p>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
        </div>
        <div className="symptoms-section">
          <label htmlFor="symptoms">Describe your symptoms:</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows="5"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QuickCheck;