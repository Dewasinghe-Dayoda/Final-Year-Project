import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from '@tensorflow/tfjs';
import "../styles/QuickCheck.css";
import uploadIcon from "../assets/upload-icon.png";
import { savePredictionResult } from '../api';
import SymptomForm from '../components/SymptomForm';

const QuickCheck = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [symptoms, setSymptoms] = useState({
    itching: "",
    redness: "",
    swelling: "",
    pain: "",
    scaling: "",
    pus: "",
  });

  // Enhanced model loading with error handling
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading TensorFlow model...');
        const modelUrl = process.env.PUBLIC_URL + '/trained_model/tfjs_model/model.json';
        const loadedModel = await tf.loadLayersModel(modelUrl);
        
        // Verify model architecture
        if (!loadedModel || !loadedModel.inputs || !loadedModel.outputs) {
          throw new Error('Model loaded but appears invalid');
        }
        
        setModel(loadedModel);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Model loading error:', error);
        setModelError(error);
      } finally {
        setModelLoading(false);
      }
    };

    loadModel();

    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, [model]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) { // 5MB limit
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setResults(null);
    } else if (file) {
      alert('Please select an image smaller than 5MB');
    }
  };

  const handleSymptomChange = (symptom, value) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value,
    }));
  };

  const preprocessImage = (imgElement) => {
    return tf.tidy(() => {
      return tf.browser.fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();
    });
  };

  const predictImage = async (imgElement) => {
    if (!model) throw new Error('Model not loaded');
    
    const tensor = preprocessImage(imgElement);
    try {
      const prediction = model.predict(tensor);
      const results = await prediction.data();
      
      const diseases = ['Cellulitis', 'Impetigo', 'Ringworm', 'Athlete Foot'];
      return diseases.map((disease, index) => ({
        disease,
        confidence: (results[index] * 100).toFixed(2),
        rawConfidence: results[index]
      })).sort((a, b) => b.rawConfidence - a.rawConfidence);
    } finally {
      tf.dispose(tensor);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !model) return;
    
    setLoading(true);
    
    try {
      const imgElement = new Image();
      imgElement.src = URL.createObjectURL(imageFile);
      
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = () => reject(new Error('Failed to load image'));
      });
      
      const predictionResults = await predictImage(imgElement);
      const formattedResults = formatResults(predictionResults);
      
      setResults(formattedResults);
      await savePredictionResult({
        imageName: imageFile.name,
        results: predictionResults,
        symptoms,
        finalDiagnosis: formattedResults
      });
    } catch (error) {
      console.error("Prediction error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatResults = (predictionResults) => {
    const topResult = predictionResults[0];
    return {
      condition: topResult.disease,
      confidence: parseFloat(topResult.confidence),
      description: `The AI analysis suggests a ${topResult.confidence}% likelihood of ${topResult.disease}.`,
      recommendations: getRecommendations(topResult.disease),
      allResults: predictionResults
    };
  };

  const getRecommendations = (condition) => {
    const recommendations = {
      'Cellulitis': ["Apply prescribed antibiotics", "Keep the area clean and elevated"],
      'Impetigo': ["Use antibiotic ointment", "Keep the area clean and dry"],
      'Ringworm': ["Apply antifungal cream", "Wash bedding in hot water"],
      'Athlete Foot': ["Use antifungal powder", "Keep feet dry"]
    };
    return recommendations[condition] || [
      "Consult a dermatologist",
      "Keep the area clean and dry"
    ];
  };

  if (modelLoading) {
    return (
      <div className="quick-check-container">
        <div className="model-loading">
          <h2>Loading AI Model</h2>
          <div className="spinner"></div>
          <p>This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (modelError) {
    return (
      <div className="quick-check-container">
        <div className="error-message">
          <h3>Model Loading Failed</h3>
          <p>{modelError.message}</p>
          <p>Please check:</p>
          <ul>
            <li>All model files are in /public/trained_model/tfjs_model/</li>
            <li>Files include model.json and .bin weights</li>
          </ul>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-check-container">
      <h1>Skin Condition Check</h1>
      
      {!results ? (
        <div className="upload-section">
          <label htmlFor="image-upload" className="upload-label">
            <img src={uploadIcon} alt="Upload" className="upload-icon" />
            <h2>Upload Skin Image</h2>
            <p className="upload-hint">Supported formats: JPG, PNG (max 5MB)</p>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" className="uploaded-image" />
              
              <div className="symptoms-section">
                <h3>Report Symptoms</h3>
                {Object.entries(symptoms).map(([symptom, value]) => (
                  <div key={symptom} className="symptom-question">
                    <p>Do you have {symptom}?</p>
                    <div className="yes-no-buttons">
                      {['yes', 'no'].map(option => (
                        <button
                          key={option}
                          className={`option-button ${value === option ? 'selected' : ''}`}
                          onClick={() => handleSymptomChange(symptom, option)}
                          type="button"
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Check Skin Condition'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="results-section">
          <h2>Analysis Results</h2>
          <div className="result-card">
            <h3>{results.condition}</h3>
            <div className="confidence-meter">
              <div 
                className="confidence-fill" 
                style={{ width: `${results.confidence}%` }}
              ></div>
              <span>{results.confidence}%</span>
            </div>
            <p className="result-description">{results.description}</p>
            
            <div className="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {results.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {symptoms.length > 0 && (
              <SymptomForm 
                disease={results.allResults[0].disease} 
                onComplete={() => navigate('/appointment')}
              />
            )}
            
            <div className="action-buttons">
              <button 
                className="appointment-button"
                onClick={() => navigate('/book-appointment')}
              >
                Book Appointment
              </button>
              <button 
                className="new-check-button"
                onClick={() => {
                  setImage(null);
                  setImageFile(null);
                  setResults(null);
                  setSymptoms({
                    itching: "",
                    redness: "",
                    swelling: "",
                    pain: "",
                    scaling: "",
                    pus: "",
                  });
                }}
              >
                New Check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCheck;