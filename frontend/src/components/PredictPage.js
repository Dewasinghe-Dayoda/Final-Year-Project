import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PredictPage.css';

function PredictPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to get prediction. Try again.');
      console.error(err);
    }
  };

  // Disease information mapping
  const diseaseInfo = {
    "Cellulitis": "A bacterial skin infection that requires antibiotics.",
    "Impetigo": "A highly contagious skin infection common in children.",
    "Ringworm": "A fungal infection that forms ring-shaped rashes.",
    "Athlete's Foot": "A fungal infection affecting feet, causing itching and scaling."
  };

  return (
    <div className="container predict-container">
      <h1 className="text-center">Skin Disease Prediction</h1>
      
      <form onSubmit={handleSubmit} className="predict-form">
        <div className="file-input-container">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn btn-primary">
            Choose File
          </label>
          {file && <span className="file-name">{file.name}</span>}
        </div>
        
        <button type="submit" className="btn btn-primary">
          Predict
        </button>
      </form>
      
      {preview && (
        <div className="preview-container">
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}
      
      {error && <p className="error-text">{error}</p>}
      
      {prediction && (
        <div className="result-container">
          <h2>Diagnosis Result</h2>
          <div className="disease-result">
            <p className="disease-name">{prediction.disease}</p>
            <p className="confidence">Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
            <div className="disease-info">
              <p>{diseaseInfo[prediction.disease]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictPage;