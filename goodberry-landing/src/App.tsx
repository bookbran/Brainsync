import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StreamlinedApp from './StreamlinedApp';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import './App.css';

function App() {
  const LandingPageComponent = () => (
    <div className="relative">
      {/* Always render the Quick View (StreamlinedApp) */}
      <StreamlinedApp />
    </div>
  );

  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPageComponent />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
