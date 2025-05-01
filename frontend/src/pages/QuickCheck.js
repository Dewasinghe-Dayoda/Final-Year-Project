import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from '@tensorflow/tfjs';
import "../styles/QuickCheck.css";
import uploadIcon from "../assets/upload-icon.png";
import { savePredictionResult } from '../api';
import '@tensorflow/tfjs-backend-webgl';

// Symptom patterns for each disease (1 = yes, 0 = no, -1 = doesn't matter)
const DISEASE_SYMPTOMS = {
  'Cellulitis': {
    itching: 1,
    redness: 1,
    swelling: 1,
    pain: 1,
    scaling: 0,
    pus: 0
  },
  'Impetigo': {
    itching: 1,
    redness: 1,
    swelling: 0,
    pain: 0,
    scaling: 1,
    pus: 1
  },
  'Ringworm': {
    itching: 1,
    redness: 1,
    swelling: 0,
    pain: 0,
    scaling: 1,
    pus: 0
  },
  'Athlete Foot': {
    itching: 1,
    redness: 1,
    swelling: 0,
    pain: 0,
    scaling: 1,
    pus: 0
  }
};

const QuickCheck = () => {
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [symptoms, setSymptoms] = useState({
    itching: "",
    redness: "",
    swelling: "",
    pain: "",
    scaling: "",
    pus: "",
  });
  const [symptomMatch, setSymptomMatch] = useState(null);

  const loadModel = async () => {
    try {
      setModelLoading(true);
      setModelError(null);
      const modelUrl = process.env.PUBLIC_URL + '/skinproscan_224_tfjs_model/model.json';
      const loadedModel = await tf.loadGraphModel(modelUrl);
      
      if (!loadedModel || !loadedModel.inputs || !loadedModel.outputs) {
        throw new Error('Model loaded but appears invalid');
      }
      
      const inputShape = loadedModel.inputs[0].shape;
      if (!inputShape || inputShape[1] !== 224 || inputShape[2] !== 224) {
        throw new Error('Model expects incorrect input dimensions');
      }
      
      setModel(loadedModel);
    } catch (error) {
      console.error('Model loading error:', error);
      setModelError(error.toString());
    } finally {
      setModelLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
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

  const calculateSymptomMatch = () => {
    const userAnswers = {
      itching: symptoms.itching === 'yes' ? 1 : 0,
      redness: symptoms.redness === 'yes' ? 1 : 0,
      swelling: symptoms.swelling === 'yes' ? 1 : 0,
      pain: symptoms.pain === 'yes' ? 1 : 0,
      scaling: symptoms.scaling === 'yes' ? 1 : 0,
      pus: symptoms.pus === 'yes' ? 1 : 0
    };

    const matches = {};
    let totalPossible = 0;

    // Calculate match percentage for each disease
    Object.keys(DISEASE_SYMPTOMS).forEach(disease => {
      const pattern = DISEASE_SYMPTOMS[disease];
      let matchCount = 0;
      let totalRelevant = 0;

      Object.keys(pattern).forEach(symptom => {
        if (pattern[symptom] !== -1) { // Only consider symptoms that matter for this disease
          totalRelevant++;
          if (userAnswers[symptom] === pattern[symptom]) {
            matchCount++;
          }
        }
      });

      const percentage = totalRelevant > 0 ? Math.round((matchCount / totalRelevant) * 100) : 0;
      matches[disease] = percentage;
      totalPossible += percentage;
    });

    // Normalize percentages so they sum to 100
    const normalizedMatches = {};
    Object.keys(matches).forEach(disease => {
      normalizedMatches[disease] = totalPossible > 0 
        ? Math.round((matches[disease] / totalPossible) * 100) 
        : 0;
    });

    // Sort by highest match
    const sortedMatches = Object.entries(normalizedMatches)
      .sort((a, b) => b[1] - a[1])
      .map(([disease, percentage]) => ({ disease, percentage }));

    setSymptomMatch(sortedMatches);
    return sortedMatches;
  };

  const preprocessImage = (imgElement) => {
    return tf.tidy(() => {
      const tensor = tf.browser.fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0));
      return tensor.expandDims(0);
    });
  };
  
  const predictImage = async (imgElement) => {
    if (!model) throw new Error('Model not loaded');
    
    const tensor = preprocessImage(imgElement);
    try {
      const prediction = model.execute(tensor);
      const results = await prediction.data();
      
      tf.dispose(prediction);
      
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
    if (!imageFile) {
      alert('Please upload an image first');
      return;
    }
  
    // Check if at least one symptom is answered
    const answeredSymptoms = Object.values(symptoms).filter(val => val !== "").length;
    if (answeredSymptoms === 0) {
      alert('Please answer at least one symptom question');
      return;
    }
  
    setLoading(true);
    setModelError(null);
    
    try {
      // Calculate symptom matches first
      const symptomResults = calculateSymptomMatch();
      console.log('Symptom Results:', symptomResults); // Debug log
  
      // Load model if not already loaded
      if (!model) {
        await loadModel();
        if (modelError) {
          console.error('Model failed to load:', modelError);
          return;
        }
      }
  
      // Process image prediction
      const imgElement = new Image();
      imgElement.src = URL.createObjectURL(imageFile);
      
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = () => reject(new Error('Failed to load image'));
      });
  
      const predictionResults = await predictImage(imgElement);
      console.log('Image Prediction Results:', predictionResults); // Debug log
  
      // Combine results
      const combinedResults = combineResults(predictionResults, symptomResults);
      console.log('Combined Results:', combinedResults); // Debug log
  
      const formattedResults = formatResults(combinedResults);
      console.log('Formatted Results:', formattedResults); // Debug log
  
      setResults(formattedResults);
      
      // Save to backend
      await savePredictionResult({
        imageName: imageFile.name,
        results: predictionResults,
        symptoms,
        symptomMatch: symptomResults,
        finalDiagnosis: formattedResults
      });
  
    } catch (error) {
      console.error("Prediction error:", error);
      setModelError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const combineResults = (imageResults, symptomResults) => {
    // Create a map of disease to image confidence
    const imageConfidence = {};
    imageResults.forEach(result => {
      imageConfidence[result.disease] = parseFloat(result.confidence);
    });
  
    // Combine with symptom results (weighted average)
    return symptomResults.map(symptomResult => {
      const imageConf = imageConfidence[symptomResult.disease] || 0;
      // Weighted average: 60% image, 40% symptoms
      const combinedConf = (imageConf * 0.6) + (symptomResult.percentage * 0.4);
      return {
        disease: symptomResult.disease,
        imageConfidence: imageConf,
        symptomConfidence: symptomResult.percentage,
        combinedConfidence: combinedConf
      };
    }).sort((a, b) => b.combinedConfidence - a.combinedConfidence);

  };

  const formatResults = (combinedResults) => {
    const topResult = combinedResults[0];
    return {
      condition: topResult.disease,
      confidence: parseFloat(topResult.combinedConfidence.toFixed(2)),
      imageConfidence: topResult.imageConfidence,
      symptomConfidence: topResult.symptomConfidence,
      description: `The AI analysis suggests a ${topResult.combinedConfidence.toFixed(2)}% likelihood of ${topResult.disease}.`,
      symptomDescription: `Based on your symptoms, there's a ${topResult.symptomConfidence}% match with ${topResult.disease}.`,
      recommendations: getRecommendations(topResult.disease),
      allResults: combinedResults
    };
  };

  const getRecommendations = (condition) => {
    const recommendations = {
      'Cellulitis': ["Apply prescribed antibiotics", "Keep the area clean and elevated", "Seek medical attention if fever develops"],
      'Impetigo': ["Use antibiotic ointment", "Keep the area clean and dry", "Avoid scratching the affected area"],
      'Ringworm': ["Apply antifungal cream", "Wash bedding in hot water", "Keep the area dry and clean"],
      'Athlete Foot': ["Use antifungal powder", "Keep feet dry", "Wear breathable shoes and socks"]
    };
    return recommendations[condition] || [
      "Consult a dermatologist",
      "Keep the area clean and dry",
      "Avoid scratching the affected area"
    ];
  };

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

                {modelLoading && (
                  <div className="model-status">
                    <div className="spinner small"></div>
                    <p>Loading AI model...</p>
                  </div>
                )}
                {modelError && !modelLoading && (
                  <div className="model-error">
                    <p className="error-text">Model failed to load:</p>
                    <p className="error-detail">{modelError}</p>
                    <button 
                      className="retry-button small"
                      onClick={loadModel}
                    >
                      Retry
                    </button>
                  </div>
                )}
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
              
              <div className="result-description">
                <p>{results.description}</p>
                <div className="symptom-match">
                  <h4>Symptom Match:</h4>
                  <p>{results.symptomDescription}</p>
                </div>
              </div>
              
              <div className="results-breakdown">
                <h4>Detailed Breakdown:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th>Image Analysis</th>
                      <th>Symptom Match</th>
                      <th>Combined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.allResults.map((result, index) => (
                      <tr key={index} className={index === 0 ? 'top-result' : ''}>
                        <td>{result.disease}</td>
                        <td>{result.imageConfidence.toFixed(2)}%</td>
                        <td>{result.symptomConfidence}%</td>
                        <td>{result.combinedConfidence.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            <div className="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {results.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            
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