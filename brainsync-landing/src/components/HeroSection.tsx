import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-adhd-blue opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-adhd-purple opacity-10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-adhd-green opacity-5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main headline - The hook that grabs ADHD brains */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-adhd-dark leading-tight mb-4">
            Finally, an AI that gets why you have{' '}
            <span className="text-adhd-blue relative">
              47 browser tabs open
            </span>
            {' '}and{' '}
            <span className="text-adhd-purple relative">
              celebrates your choices
            </span>
          </h1>
          <p className="text-lg md:text-xl text-adhd-gray font-medium italic">
            (even the "bad" ones)
          </p>
        </div>

        {/* Subheadline */}
        <div className="mb-10">
          <p className="text-xl md:text-2xl text-adhd-gray max-w-4xl mx-auto leading-relaxed">
            BrainSync Pro connects <span className="adhd-highlight">ALL your apps</span> to deliver gentle, 
            choice-celebrating daily guidance via email. Built for ADHD brains who are 
            <span className="adhd-highlight">tired of productivity pressure</span>.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-adhd-green text-xl">📅</span>
            <span className="text-adhd-dark font-medium">Google Calendar + Habitica</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-adhd-purple text-xl">🧠</span>
            <span className="text-adhd-dark font-medium">ADHD-Native AI</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-adhd-blue text-xl">✉️</span>
            <span className="text-adhd-dark font-medium">Daily Gentle Emails</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-adhd-orange text-xl">😊</span>
            <span className="text-adhd-dark font-medium">Choice Celebration</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#waitlist" 
            className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
          >
            Get My First Choice-Empowered Day
          </a>
          <a 
            href="#demo" 
            className="text-adhd-blue hover:text-adhd-purple font-semibold text-lg underline decoration-2 underline-offset-4 transition-colors"
          >
            See How It Works ↓
          </a>
        </div>

        {/* Trust signal */}
        <div className="mt-12">
          <p className="text-adhd-gray text-sm">
            🚀 <span className="font-medium">Built by ADHD brains, for ADHD brains</span> | 
            ✨ <span className="font-medium">No new apps to download</span> | 
            💙 <span className="font-medium">Zero productivity guilt</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 