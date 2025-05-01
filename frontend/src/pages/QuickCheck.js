import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/QuickCheck.css";
import uploadIcon from "../assets/upload-icon.png";

const DISEASE_SYMPTOMS = {
  'Cellulitis': {
    itching: 1,       
    redness: 1,       
    swelling: 1,      
    pain: 1,          
    scaling: 0,       
    pus: 0,           
    warmth: 1,        
    fever: -1         
  },
  'Impetigo': {
    itching: 1,       
    redness: 1,       
    swelling: 0,      
    pain: 0,          
    scaling: 1,       
    pus: 1,           
    blisters: 1,      
    face_common: 1    
  },
  'Ringworm': {
    itching: 1,       
    redness: 1,       
    swelling: 0,      
    pain: 0,
    scaling: 1,       
    pus: 0,
    circular: 1,      
    location: -1,     
    hair_loss: 1      
  },
  'Athlete Foot': {
    itching: 1,       
    redness: 1,       
    swelling: 0,
    pain: 0,
    scaling: 1,       
    pus: 0,
    cracking: 1,      
    odor: 1,          
    location: 1       
  }
};

const QuickCheck = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptoms, setSymptoms] = useState({
    itching: "",
    redness: "",
    swelling: "",
    pain: "",
    scaling: "",
    pus: "",
    circular: "",
    cracking: "",
    location: ""
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 5 * 1024 * 1024) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setResults(null);
      setError(null);
    } else if (file) {
      alert('Please select an image smaller than 5MB');
    }
  };

  const handleSymptomChange = (symptom, value) => {
    setSymptoms(prev => ({ ...prev, [symptom]: value }));
  };

  const calculateSymptomMatch = () => {
    const userAnswers = {
      itching: symptoms.itching === 'yes' ? 1 : 0,
      redness: symptoms.redness === 'yes' ? 1 : 0,
      swelling: symptoms.swelling === 'yes' ? 1 : 0,
      pain: symptoms.pain === 'yes' ? 1 : 0,
      scaling: symptoms.scaling === 'yes' ? 1 : 0,
      pus: symptoms.pus === 'yes' ? 1 : 0,
      circular: symptoms.circular === 'yes' ? 1 : 0,
      cracking: symptoms.cracking === 'yes' ? 1 : 0,
      location: symptoms.location
    };

    const matches = Object.keys(DISEASE_SYMPTOMS).map(disease => {
      const pattern = DISEASE_SYMPTOMS[disease];
      let matchCount = 0;
      let totalRelevant = 0;

      Object.keys(pattern).forEach(symptom => {
        if (pattern[symptom] !== -1) {
          totalRelevant++;
          if (userAnswers[symptom] === pattern[symptom]) matchCount++;
        }
      });

      return {
        disease,
        percentage: totalRelevant > 0 ? Math.round((matchCount / totalRelevant) * 100) : 0
      };
    });

    return matches.sort((a, b) => b.percentage - a.percentage);
  };

  const predictImage = async () => {
    if (!imageFile) throw new Error('Please upload an image first');

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return {
        disease: response.data.disease,
        confidence: Math.round(response.data.confidence * 100),
        allPredictions: [
          { 
            disease: response.data.disease, 
            confidence: Math.round(response.data.confidence * 100) 
          }
        ]
      };
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.error || 'Failed to get prediction');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.values(symptoms).filter(val => val !== "").length === 0) {
      alert('Please answer at least one symptom question');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const symptomResults = calculateSymptomMatch();
      const modelPrediction = await predictImage();
      
      setResults({
        modelPrediction,
        symptomResults,
        finalDisease: modelPrediction.disease,
        modelConfidence: modelPrediction.confidence,
        symptomMatchForModel: symptomResults.find(
          item => item.disease === modelPrediction.disease
        )?.percentage || 0,
        shouldUseModelPrediction: true,
        recommendations: getRecommendations(modelPrediction.disease)
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
      <h1>Skin Condition Quick Check</h1>
      
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
                    {/* Basic Symptoms */}
                    {!['circular', 'cracking', 'location'].includes(symptom) && (
                      <>
                        <p>Do you have {symptom}?</p>
                        <div className="yes-no-buttons">
                          {['yes', 'no'].map(option => (
                            <button
                              key={option}
                              className={`option-button ${option} ${value === option ? 'selected' : ''}`}
                              onClick={() => handleSymptomChange(symptom, option)}
                              type="button"
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Special Case: Circular Rash */}
                    {symptom === 'circular' && (
                      <>
                        <p>Does the rash have a distinct circular/ring shape?</p>
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
                      </>
                    )}

                    {/* Special Case: Skin Cracking */}
                    {symptom === 'cracking' && (
                      <>
                        <p>Is there skin cracking or peeling between toes?</p>
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
                      </>
                    )}

                    {/* Special Case: Location Selector */}
                    {symptom === 'location' && (
                      <div className="location-selector">
                        <p>Where is the affected area located?</p>
                        <select
                          value={value}
                          onChange={(e) => handleSymptomChange('location', e.target.value)}
                          className="location-dropdown"
                        >
                          <option value="">Select location</option>
                          <option value="feet">Feet (between toes)</option>
                          <option value="scalp">Scalp</option>
                          <option value="body">Body</option>
                          <option value="face">Face</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Check Skin Condition'}
                </button>

                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="results-section">
          <h2>Analysis Results</h2>
          
          <div className="results-comparison">
            <div className="model-results">
              <h3>AI Model Analysis</h3>
              <div className="result-card">
                <h4>{results.modelPrediction.disease}</h4>
                <div className="confidence-meter">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${results.modelConfidence}%` }}
                  ></div>
                  <span>{results.modelConfidence}% confidence</span>
                </div>
              </div>
            </div>
            
            <div className="symptom-results">
              <h3>Symptom Checker</h3>
              <div className="result-card">
                <h4>{results.symptomResults[0].disease}</h4>
                <div className="confidence-meter">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${results.symptomResults[0].percentage}%` }}
                  ></div>
                  <span>{results.symptomResults[0].percentage}% match</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="final-result">
            <h3>Final Assessment</h3>
            <div className={`result-card ${results.shouldUseModelPrediction ? 'model-based' : 'symptom-based'}`}>
              <h4>{results.finalDisease}</h4>
              <p>
                {results.shouldUseModelPrediction
                  ? "The AI model and your symptoms both strongly suggest this condition."
                  : "Using symptom analysis as the primary indicator."}
              </p>
            </div>
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
              onClick={() => navigate('/AppointmentPage')}
            >
              Book Appointment Now
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
                  circular: "",
                  cracking: "",
                  location: ""
                });
              }}
            >
              Perform New Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCheck;