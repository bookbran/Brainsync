import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarApp from './CalendarApp';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<CalendarApp />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
