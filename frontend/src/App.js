import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as tf from '@tensorflow/tfjs';
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './styles/GlobalStyle.css';
import Home from "./pages/Home";
import QuickCheck from "./pages/QuickCheck";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import UserProfile from "./pages/UserProfile";
import Login from "./auth/Login";
import Register from "./auth/Register";
import History from "./pages/History";
import FAQ from "./pages/FAQ";
import Notifications from "./pages/Notifications";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// import SkinCheck from "./components/SkinCheck";
import AppointmentPage from "./pages/AppointmentPage";
import ClinicDetailsPage from './pages/ClinicDetailsPage';
import AwarenessPage from './pages/AwarenessPage';
import Cellulitis from './pages/DiseaseDetails/Cellulitis';
import Impetigo from './pages/DiseaseDetails/Impetigo';
import AthletesFoot from './pages/DiseaseDetails/AthletesFoot';
import Ringworm from './pages/DiseaseDetails/Ringworm';
import PredictPage from "./components/PredictPage";

function App() {
  // TensorFlow.js memory management
  useEffect(() => {
    let isMounted = true;

    const initializeTF = async () => {
      try {
        // Wait for TensorFlow to be ready
        await tf.ready();
        
        if (isMounted) {
          // Optimize memory usage
          tf.ENV.set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
          
          // Enable production mode if in production
          if (process.env.NODE_ENV === 'production') {
            tf.enableProdMode();
          }
          
          console.log('TensorFlow initialized with backend:', tf.getBackend());
        }
      } catch (error) {
        console.error('TensorFlow initialization error:', error);
      }
    };

    initializeTF();

    // Cleanup function
    return () => {
      isMounted = false;
      
      try {
        // Only clean up if backend exists
        if (tf.getBackend()) {
          console.log('Cleaning up TensorFlow resources');
          tf.disposeVariables();
          
          // Skip removeBackend() to prevent errors
          // tf.removeBackend() is problematic in React's dev mode
        }
      } catch (error) {
        console.warn('Error during TensorFlow cleanup:', error);
      }
    };
  }, []);

  return (
    <Router><div className="container">
      <Header />
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/QuickCheck" element={<QuickCheck />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Terms" element={<TermsOfService />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/History" element={<History />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        {/* <Route path="/SkinCheck" element={<SkinCheck />} /> */}
        <Route path="/AppointmentPage" element={<AppointmentPage />} />
        <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="/disease/cellulitis" element={<Cellulitis />} />
        <Route path="/disease/impetigo" element={<Impetigo />} />
        <Route path="/disease/athletes-foot" element={<AthletesFoot />} />
        <Route path="/disease/ringworm" element={<Ringworm />} />   
        <Route path="/skin-check" element={<PredictPage />} />   
      </Routes>
      <Footer />
     </div></Router>
  );
}

export default App;