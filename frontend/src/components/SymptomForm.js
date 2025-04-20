import React, { useState } from 'react';
import { submitSymptoms } from '../api';

const SymptomForm = ({ disease, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sample questions (replace with API-fetched questions in real implementation)
  const questions = {
    'Cellulitis': [
      "Is the affected area warm to touch?",
      "Do you have fever?",
      "Is the redness spreading?"
    ],
    'Impetigo': [
      "Do you see honey-colored crusts?",
      "Is the rash itchy?",
      "Are there fluid-filled blisters?"
    ],
    'Ringworm': [
      "Is the rash circular with raised edges?",
      "Does it itch intensely?",
      "Is the center of the rash clear?"
    ],
    'Athlete Foot': [
      "Do you have scaling between toes?",
      "Is there a burning sensation?",
      "Do you notice foul odor?"
    ]
  };

  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitSymptoms({
        disease,
        answers: Object.entries(answers).map(([question, answer]) => ({
          question,
          answer
        }))
      });
      onComplete();
    } catch (error) {
      alert('Failed to submit symptoms: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="symptom-form">
      <h3>{disease} Symptom Checker</h3>
      <form onSubmit={handleSubmit}>
        {questions[disease]?.map((question, index) => (
          <div key={index} className="form-group">
            <label>{question}</label>
            <select
              required
              onChange={(e) => handleAnswerChange(question, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="unsure">Unsure</option>
            </select>
          </div>
        ))}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Symptoms'}
        </button>
      </form>
    </div>
  );
};

export default SymptomForm;