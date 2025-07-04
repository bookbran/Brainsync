import React from 'react';
import StreamlinedHero from './components/streamlined/StreamlinedHero';
import ProblemVisual from './components/streamlined/ProblemVisual';
import ProminentDemo from './components/streamlined/ProminentDemo';
import ChoiceTextsSection from './components/streamlined/ChoiceTextsSection';
import CalendarEvolutionSection from './components/streamlined/CalendarEvolutionSection';
import VisualTestimonials from './components/streamlined/VisualTestimonials';
import WeeklySupportSection from './components/streamlined/WeeklySupportSection';
import FocusedSignup from './components/streamlined/FocusedSignup';
import Footer from './components/Footer';

function StreamlinedApp() {
  return (
    <div className="Streamlined-App min-h-screen bg-gradient-to-br from-adhd-light via-white to-blue-50">
      <StreamlinedHero />
      <ProblemVisual />
      <ProminentDemo />
      <ChoiceTextsSection />
      <CalendarEvolutionSection />
      <VisualTestimonials />
      <WeeklySupportSection />
      <FocusedSignup />
      <Footer />
    </div>
  );
}

export default StreamlinedApp; 