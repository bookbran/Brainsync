import React from 'react';
import CalendarHeroSection from './components/calendar/CalendarHeroSection';
import OnboardingFlowSection from './components/calendar/OnboardingFlowSection';
import CalendarEmailPreview from './components/calendar/CalendarEmailPreview';
import CalendarEvolutionSection from './components/calendar/CalendarEvolutionSection';
import ConsciousChoiceSection from './components/calendar/ConsciousChoiceSection';
import CalendarIntegrationSection from './components/calendar/CalendarIntegrationSection';
import TechnicalAdvantagesCalendar from './components/calendar/TechnicalAdvantagesCalendar';
import WaitlistSignupCalendar from './components/calendar/WaitlistSignupCalendar';
import Footer from './components/Footer';

function CalendarApp() {
  return (
    <div className="Calendar-App min-h-screen bg-gradient-to-br from-adhd-light via-white to-blue-50">
      <CalendarHeroSection />
      <OnboardingFlowSection />
      <CalendarEmailPreview />
      <CalendarEvolutionSection />
      <ConsciousChoiceSection />
      <CalendarIntegrationSection />
      <TechnicalAdvantagesCalendar />
      <WaitlistSignupCalendar />
      <Footer />
    </div>
  );
}

export default CalendarApp; 