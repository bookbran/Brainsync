import React, { useState } from 'react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToWaitlist = () => {
    const waitlistElement = document.querySelector('#waitlist, .waitlist-section, [class*="waitlist"], [class*="WaitlistSignup"]');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    let element = null;
    
    // Map navigation items to actual section IDs or classes
    switch (sectionId) {
      case 'onboarding':
        element = document.querySelector('#setup, [class*="OnboardingFlow"], [class*="Onboarding"]');
        break;
      case 'calendar-integration':
        // Set hash to trigger state change, then scroll to section
        window.location.hash = '#calendar-integration-action';
        setTimeout(() => {
          const onboardingSection = document.querySelector('#setup');
          if (onboardingSection) {
            onboardingSection.scrollIntoView({ behavior: 'smooth' });
          }
          setTimeout(() => {
            const targetElement = document.querySelector('#calendar-integration-action');
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }, 100);
        break;
      case 'brain-trap':
        // Set hash to trigger state change (auto-selects 10:30 PM), then scroll to section
        window.location.hash = '#brain-trap-support';
        setTimeout(() => {
          const onboardingSection = document.querySelector('#setup');
          if (onboardingSection) {
            onboardingSection.scrollIntoView({ behavior: 'smooth' });
          }
          setTimeout(() => {
            const targetElement = document.querySelector('#weekly-support-system');
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }, 100);
        break;
      case 'weekly-emails':
        // First scroll to the EmailPreview section, then activate the followthrough tab
        const emailSection = document.querySelector('#demo');
        if (emailSection) {
          emailSection.scrollIntoView({ behavior: 'smooth' });
        }
        setTimeout(() => {
          // Try to find and click the weekly support tab
          const emailButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent?.includes('Weekly Support')
          );
          if (emailButtons.length > 0) {
            (emailButtons[0] as HTMLElement).click();
          }
        }, 500);
        break;
      case 'labs':
        element = document.querySelector('#labs');
        break;
      default:
        element = document.getElementById(sectionId);
    }

    if (element && sectionId !== 'calendar-integration' && sectionId !== 'brain-trap' && sectionId !== 'weekly-emails') {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-2xl mr-2" style={{
              filter: 'hue-rotate(340deg) saturate(2.8) brightness(0.9) contrast(1.3)',
              textShadow: '0 0 5px rgba(190, 18, 60, 0.9), 0 0 10px rgba(219, 39, 119, 0.6), 0 0 15px rgba(136, 19, 55, 0.5)'
            }}>🫐</span>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              goodberry
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden min-[900px]:flex items-center space-x-8">
            <a 
              href="#onboarding" 
              onClick={(e) => { e.preventDefault(); scrollToSection('onboarding'); }}
              className="text-white hover:text-yellow-300 px-3 py-2 text-sm font-medium transition-colors"
            >
              Onboarding Demo
            </a>

            <a 
              href="#calendar-integration" 
              onClick={(e) => { e.preventDefault(); scrollToSection('calendar-integration'); }}
              className="text-white hover:text-yellow-300 px-3 py-2 text-sm font-medium transition-colors"
            >
              Calendar Integration
            </a>

            <a 
              href="#brain-trap" 
              onClick={(e) => { e.preventDefault(); scrollToSection('brain-trap'); }}
              className="text-white hover:text-yellow-300 px-3 py-2 text-sm font-medium transition-colors"
            >
              Brain Trap Support
            </a>

            <a 
              href="#weekly-emails" 
              onClick={(e) => { e.preventDefault(); scrollToSection('weekly-emails'); }}
              className="text-white hover:text-yellow-300 px-3 py-2 text-sm font-medium transition-colors"
            >
              Weekly Emails
            </a>

            <a 
              href="#labs" 
              onClick={(e) => { e.preventDefault(); scrollToSection('labs'); }}
              className="text-white hover:text-yellow-300 px-3 py-2 text-sm font-medium transition-colors"
            >
              Labs
            </a>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden min-[900px]:flex items-center">
            <button 
              onClick={scrollToWaitlist}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-md text-sm font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 flex items-center group transform hover:scale-105"
            >
              Join waitlist
              <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="min-[900px]:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 p-2 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="min-[900px]:hidden border-t border-white/20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="#onboarding" 
                onClick={(e) => { e.preventDefault(); scrollToSection('onboarding'); }}
                className="block px-3 py-2 text-base text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Onboarding Demo
              </a>

              <a 
                href="#calendar-integration" 
                onClick={(e) => { e.preventDefault(); scrollToSection('calendar-integration'); }}
                className="block px-3 py-2 text-base text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Calendar Integration
              </a>

              <a 
                href="#brain-trap" 
                onClick={(e) => { e.preventDefault(); scrollToSection('brain-trap'); }}
                className="block px-3 py-2 text-base text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Brain Trap Support
              </a>

              <a 
                href="#weekly-emails" 
                onClick={(e) => { e.preventDefault(); scrollToSection('weekly-emails'); }}
                className="block px-3 py-2 text-base text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Weekly Emails
              </a>

              <a 
                href="#labs" 
                onClick={(e) => { e.preventDefault(); scrollToSection('labs'); }}
                className="block px-3 py-2 text-base text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Labs
              </a>

              <div className="pt-4 pb-3 border-t border-white/20">
                <button 
                  onClick={scrollToWaitlist}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-md text-sm font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 flex items-center justify-center group transform hover:scale-105"
                >
                  Join waitlist
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 