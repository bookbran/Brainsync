import React, { useState } from 'react';
import { Calendar, Database, ArrowRightLeft } from 'lucide-react';
import HeroSection from './components/HeroSection';
import InteractiveDemo from './components/InteractiveDemo';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import EmailPreview from './components/EmailPreview';
import WaitlistSignup from './components/WaitlistSignup';
import TechnicalAdvantages from './components/TechnicalAdvantages';
import Footer from './components/Footer';
import CalendarApp from './CalendarApp';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState<'api' | 'calendar'>('calendar');

  if (viewMode === 'calendar') {
    return (
      <div className="App min-h-screen bg-white">
        {/* Version Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Landing Page:</span>
              <button
                onClick={() => setViewMode('api')}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                <span className="text-sm">API Integration</span>
              </button>
              <ArrowRightLeft className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => setViewMode('calendar')}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Calendar First</span>
              </button>
            </div>
          </div>
        </div>
        
        <CalendarApp />
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-adhd-light via-white to-blue-50">
      {/* Version Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Landing Page:</span>
            <button
              onClick={() => setViewMode('api')}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg"
            >
              <Database className="w-4 h-4" />
              <span className="text-sm">API Integration</span>
            </button>
            <ArrowRightLeft className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => setViewMode('calendar')}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Calendar First</span>
            </button>
          </div>
        </div>
      </div>
      
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
