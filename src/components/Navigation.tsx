import React, { useState } from 'react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToWaitlist = () => {
    const waitlistElement = document.querySelector('#waitlist, .waitlist-section, [class*="waitlist"], [class*="WaitlistSignup"]');
    if (waitlistElement) {
      waitlistElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId) || document.querySelector(`[class*="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Stripe-inspired animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated triangular shapes */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-96 h-96 bg-gradient-to-br from-purple-600/30 to-pink-600/30 transform rotate-45 animate-pulse"
            style={{ top: '-10%', left: '-5%', animationDuration: '8s' }}
          ></div>
          <div 
            className="absolute w-80 h-80 bg-gradient-to-br from-blue-500/25 to-cyan-500/25 transform rotate-12 animate-bounce"
            style={{ top: '20%', right: '-10%', animationDuration: '10s' }}
          ></div>
          <div 
            className="absolute w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transform -rotate-12 animate-pulse"
            style={{ bottom: '10%', left: '30%', animationDuration: '12s' }}
          ></div>
          <div 
            className="absolute w-32 h-32 bg-gradient-to-br from-pink-400/15 to-rose-400/15 rounded-full animate-ping"
            style={{ top: '60%', right: '20%', animationDuration: '6s' }}
          ></div>
          <div 
            className="absolute w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full animate-pulse"
            style={{ top: '40%', left: '70%', animationDuration: '9s' }}
          ></div>
        </div>
        
        {/* Overlay gradient for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-transparent to-blue-900/50"></div>
      </div>

      {/* Navigation content */}
      <nav className="relative z-10 border-b border-white/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-2xl mr-2">🫐</span>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                goodberry
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden min-[900px]:flex items-center space-x-8">
              <a 
                href="#demo" 
                onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}
                className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Demo
              </a>
              <a 
                href="#problem" 
                onClick={(e) => { e.preventDefault(); scrollToSection('problem'); }}
                className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Problem
              </a>
              <a 
                href="#solution" 
                onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }}
                className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Solution
              </a>
              <a 
                href="#email" 
                onClick={(e) => { e.preventDefault(); scrollToSection('email'); }}
                className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Email Preview
              </a>
              <a 
                href="#tech" 
                onClick={(e) => { e.preventDefault(); scrollToSection('tech'); }}
                className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Tech
              </a>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden min-[900px]:flex items-center">
              <button 
                onClick={scrollToWaitlist}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-md text-sm font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 flex items-center group transform hover:scale-105 shadow-lg"
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 p-2 rounded-lg transition-colors duration-200"
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
            <div className="min-[900px]:hidden border-t border-white/20 bg-black/20 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a 
                  href="#demo" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}
                  className="block px-3 py-2 text-base text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Demo
                </a>
                <a 
                  href="#problem" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('problem'); }}
                  className="block px-3 py-2 text-base text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Problem
                </a>
                <a 
                  href="#solution" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }}
                  className="block px-3 py-2 text-base text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Solution
                </a>
                <a 
                  href="#email" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('email'); }}
                  className="block px-3 py-2 text-base text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Email Preview
                </a>
                <a 
                  href="#tech" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('tech'); }}
                  className="block px-3 py-2 text-base text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  Tech
                </a>
                <div className="pt-4 pb-3 border-t border-white/20">
                  <button 
                    onClick={scrollToWaitlist}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-md text-sm font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 flex items-center justify-center group transform hover:scale-105 shadow-lg"
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
    </div>
  );
};

export default Navigation; 