import React from 'react';
import DiseaseCard from '../components/DiseaseCard/DiseaseCard';
import '../styles/AwarenessPage.css';

const AwarenessPage = () => {
  const diseases = [
    {
      id: 'cellulitis',
      name: "Cellulitis",
      imageName: "cellulitis.jpg",
      shortDescription: "A common bacterial skin infection of the lower dermis and subcutaneous tissue that can be life-threatening if left untreated.",
      keyFeatures: [
        "Red, painful, swollen skin",
        "Often affects limbs",
        "May cause fever and chills",
        "Can lead to serious complications if untreated"
      ],
      videoLink: "https://youtu.be/CIg7B4wPJ0o?si=q2ZQdbqumVceE0Bt"
    },
    {
      id: 'impetigo',
      name: "Impetigo",
      imageName: "impetigo.jpg",
      shortDescription: "A highly contagious superficial bacterial skin infection characterized by pustules and honey-colored crusted erosions.",
      keyFeatures: [
        "Common in children",
        "Highly contagious",
        "Honey-colored crusts",
        "Can be non-bullous or bullous"
      ],
      videoLink: "https://youtu.be/BVJdP5sq_Ug?si=G2JNKUAmdOzJs3mA"
    },
    {
      id: 'athletes-foot',
      name: "Athlete's Foot",
      imageName: "athlete's foot.jpeg",
      shortDescription: "A fungal infection of the foot that most often results in peeling skin and fissuring between the toes.",
      keyFeatures: [
        "Peeling skin between toes",
        "Often itchy",
        "Common in athletes",
        "Can spread to other body parts"
      ],
      videoLink: "https://youtu.be/4c3xBEJXbcU?si=wh0aypf3yYhYdDFC"
    },
    {
      id: 'ringworm',
      name: "Ringworm (Tinea Corporis)",
      imageName: "ringworm.jpg",
      shortDescription: "A superficial fungal infection of the skin that presents with characteristic ring-shaped lesions.",
      keyFeatures: [
        "Ring-shaped red patches",
        "Scaly leading edge",
        "Itchy",
        "Can spread through contact"
      ],
      videoLink: "https://youtu.be/cnW_oL7UDwc?si=mP4QPvfLlGZk-Dpf"
    }
  ];

  return (
    <div className="awareness-container">
      <h1 className="awareness-title">Skin Disease Awareness</h1>
      <p className="awareness-intro">
        Learn about common skin conditions, their symptoms, and treatments. 
        Click "Learn More" for detailed information about each condition.
      </p>
      
      <div className="disease-grid">
        {diseases.map((disease, index) => (
          <DiseaseCard key={index} disease={disease} />
        ))}
      </div>
    </div>
  );
};

export default AwarenessPage;