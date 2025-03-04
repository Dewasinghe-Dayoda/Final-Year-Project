import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/QuickCheck" element={<QuickCheck />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Terms" element={<TermsOfService />} />
        <Route path="/User" element={<UserProfile />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/History" element={<History/>} />
        <Route path="/FAQ"     element={<FAQ/>} />
        <Route path="/Notifications" element={<Notifications/>}/>
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
//<Route path="/profile" element={<ProtectedRoute user={user}><UserProfile /></ProtectedRoute>} />
