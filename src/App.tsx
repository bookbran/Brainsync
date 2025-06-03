import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import InteractiveDemo from './components/InteractiveDemo';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import EmailPreview from './components/EmailPreview';
import WaitlistSignup from './components/WaitlistSignup';
import TechnicalAdvantages from './components/TechnicalAdvantages';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-adhd-light via-white to-blue-50">
      {/* Hero Section - The Hook */}
      <HeroSection />
      
      {/* Problem Section - Recognition */}
      <ProblemSection />
      
      {/* Interactive Demo - Experience the Magic */}
      <InteractiveDemo />
      
      {/* Solution Section - How We're Different */}
      <SolutionSection />
      
      {/* Email Preview - See the Daily Experience */}
      <EmailPreview />
      
      {/* Technical Advantages - Why We're Superior */}
      <TechnicalAdvantages />
      
      {/* Waitlist Signup - The Conversion */}
      <WaitlistSignup />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App; 