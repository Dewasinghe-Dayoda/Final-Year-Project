import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuickCheck.css";
import uploadIcon from "../assets/upload-icon.png";

const QuickCheck = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState({
    itching: "",
    redness: "",
    swelling: "",
    pain: "",
    scaling: "",
    pus: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResults(null); // Clear previous results when new image is uploaded
    }
  };

  const handleSymptomChange = (symptom, value) => {
    setSymptoms({
      ...symptoms,
      [symptom]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to your classification model
    try {
      // In a real app, you would send the image and symptoms to your backend
      // const response = await axios.post('/api/classify', { image, symptoms });
      
      // Mock response - replace with actual API call
      setTimeout(() => {
        const mockResults = {
          condition: "Fungal Infection",
          confidence: 87,
          description: "The AI analysis suggests a high likelihood of fungal infection based on the visual patterns and your reported symptoms.",
          recommendations: [
            "Apply antifungal cream twice daily",
            "Keep the area clean and dry",
            "Avoid scratching the affected area"
          ]
        };
        setResults(mockResults);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setLoading(false);
    }
  };

  return (
    <div className="quick-check-container">
      <h1>Skin Condition Check</h1>
      
      {!results ? (
        <form onSubmit={handleSubmit}>
          <div className="upload-section">
            <h2>Upload Skin Image</h2>
            <label htmlFor="image-upload" className="upload-label">
              <img src={uploadIcon} alt="Upload" className="upload-icon" />
              <p><strong>Click to upload an image of your skin condition</strong></p>
              <p className="upload-hint">(Clear, well-lit images work best)</p>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
            {image && (
              <div className="image-preview">
                <img src={image} alt="Uploaded preview" className="uploaded-image" />
              </div>
            )}
          </div>

          <div className="symptoms-section">
            <h2>Tell Us About Your Symptoms</h2>
            <p>Please answer the following questions:</p>
            
            <div className="symptom-question">
              <p>1. Do you experience itching in the affected area?</p>
              <div className="yes-no-buttons">
                <button
                  type="button"
                  className={`option-button ${symptoms.itching === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('itching', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`option-button ${symptoms.itching === 'no' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('itching', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <div className="symptom-question">
              <p>2. Is there noticeable redness?</p>
              <div className="yes-no-buttons">
                <button
                  type="button"
                  className={`option-button ${symptoms.redness === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('redness', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`option-button ${symptoms.redness === 'no' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('redness', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <div className="symptom-question">
              <p>3. Is there any swelling?</p>
              <div className="yes-no-buttons">
                <button
                  type="button"
                  className={`option-button ${symptoms.swelling === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('swelling', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`option-button ${symptoms.swelling === 'no' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('swelling', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <div className="symptom-question">
              <p>4. Do you feel pain in the affected area?</p>
              <div className="yes-no-buttons">
                <button
                  type="button"
                  className={`option-button ${symptoms.pain === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('pain', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`option-button ${symptoms.pain === 'no' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('pain', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <div className="symptom-question">
              <p>5. Is there any scaling or flaking of skin?</p>
              <div className="yes-no-buttons">
                <button
                  type="button"
                  className={`option-button ${symptoms.scaling === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('scaling', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`option-button ${symptoms.scaling === 'no' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('scaling', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <div className="symptom-question">
              <p>6. Is there any pus or discharge?</p>
              <div className="yes-no-buttons">
                <button
                  type="button"
                  className={`option-button ${symptoms.pus === 'yes' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('pus', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`option-button ${symptoms.pus === 'no' ? 'selected' : ''}`}
                  onClick={() => handleSymptomChange('pus', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Skin Condition'}
            </button>
          </div>
        </form>
      ) : (
        <div className="results-section">
          <h2>Analysis Results</h2>
          
          <div className="result-card">
            <h3>Condition: {results.condition}</h3>
            <div className="confidence-meter">
              <div className="confidence-fill" style={{ width: `${results.confidence}%` }}></div>
              <span>{results.confidence}% Confidence</span>
            </div>
            
            <p className="result-description">{results.description}</p>
            
            <div className="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {results.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="action-buttons">
              <button 
                className="appointment-button"
                onClick={() => navigate('/Contact')} // Or create a specific appointment page
              >
                Book Dermatologist Appointment
              </button>
              <button 
                className="new-check-button"
                onClick={() => {
                  setImage(null);
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
                Perform New Check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCheck;