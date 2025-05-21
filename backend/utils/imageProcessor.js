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