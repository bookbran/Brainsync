import React, { useState, useEffect, useRef } from 'react';

const ProblemVisual: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const scenarios = [
    {
      id: 'sunday-anxiety',
      title: 'Sunday Night Anxiety',
      subtitle: 'Calendar gathering dust',
      emoji: '😰',
      timeLabel: 'Sunday Night',
      statusLabel: '🕸️ Gathering Dust',
      borderColor: 'border-gray-300',
      bgGradient: 'from-gray-100 to-slate-100',
      features: [
        { color: 'bg-gray-400', text: 'Calendar completely unused' },
        { color: 'bg-gray-500', text: 'Sunday scaries kicking in' },
        { color: 'bg-slate-400', text: 'Week feels overwhelming' }
      ],
      visual: 'dusty-calendar'
    },
    {
      id: 'sunday-planning',
      title: 'Sunday Night Planning Session',
      subtitle: 'Perfect organization attempt',
      emoji: '📅',
      timeLabel: 'Sunday Night',
      statusLabel: '✨ Perfect Plan',
      borderColor: 'border-green-200',
      bgGradient: 'from-green-100 to-blue-100',
      features: [
        { color: 'bg-blue-400', text: '17 color-coded time blocks' },
        { color: 'bg-green-400', text: 'Every minute optimized' },
        { color: 'bg-purple-400', text: 'Unrealistic expectations' }
      ],
      visual: 'organized-calendar'
    },
    {
      id: 'monday-spiral',
      title: 'Late Monday Night Reality',
      subtitle: 'The Netflix spiral begins',
      emoji: '📺',
      timeLabel: 'Late Monday Night',
      statusLabel: '🌙 3AM Spiral',
      borderColor: 'border-indigo-200',
      bgGradient: 'from-indigo-100 to-purple-100',
      features: [
        { color: 'bg-indigo-400', text: '3AM Netflix binge spiral' },
        { color: 'bg-purple-400', text: '"Just one more episode"' },
        { color: 'bg-pink-400', text: 'Tomorrow\'s presentation anxiety' }
      ],
      visual: 'netflix-spiral'
    },
    {
      id: 'tuesday-chaos',
      title: 'Tuesday Reality Check',
      subtitle: 'When plans meet reality',
      emoji: '😵‍💫',
      timeLabel: 'Tuesday Reality',
      statusLabel: '🔥 Chaos Mode',
      borderColor: 'border-red-200',
      bgGradient: 'from-red-100 to-orange-100',
      features: [
        { color: 'bg-red-400', text: 'Nothing happened as planned' },
        { color: 'bg-orange-400', text: '47 browser tabs open' },
        { color: 'bg-yellow-400', text: 'Guilt and frustration' }
      ],
      visual: 'chaos-mode'
    }
  ];

  // Intersection Observer to detect when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-advance animation when visible
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    }, 4000); // 4 seconds per scenario

    return () => clearInterval(timer);
  }, [isVisible, scenarios.length]);

  const currentData = scenarios[currentScenario];

  const renderVisual = () => {
    const current = scenarios[currentScenario];
    
    switch (current.visual) {
      case 'dusty-calendar':
        return (
          <div className="absolute inset-4">
            {/* Dusty Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 opacity-40">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className={`h-6 rounded ${
                    i % 7 === 0 || i % 7 === 6 ? 'bg-gray-200' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            {/* Spider webs */}
            <div className="absolute top-2 left-2 text-gray-400 text-2xl animate-pulse">🕸️</div>
            <div className="absolute top-2 right-2 text-gray-400 text-2xl animate-pulse">🕸️</div>
            {/* Dust particles */}
            <div className="absolute inset-0 bg-gray-200 opacity-20 animate-pulse"></div>
            {/* Center calendar icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl text-gray-400 opacity-60 animate-bounce">📅</div>
            </div>
          </div>
        );
        
      case 'organized-calendar':
        return (
          <div className="absolute inset-4">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className={`h-6 rounded transition-all duration-500 ${
                    i % 7 === 0 || i % 7 === 6
                      ? 'bg-gray-200'
                      : Math.random() > 0.3
                      ? 'bg-blue-400'
                      : 'bg-green-400'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'netflix-spiral':
        return (
          <div className="absolute inset-4">
            {/* Spiral animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 rounded-full border-4 border-purple-300 animate-spin opacity-30"></div>
              <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-pink-300 animate-spin opacity-40" style={{ animationDuration: '3s' }}></div>
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-indigo-300 animate-spin opacity-50" style={{ animationDuration: '2s' }}></div>
            </div>
            {/* Screen glow */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-10 bg-gradient-to-t from-blue-400 to-purple-400 rounded opacity-80 animate-pulse"></div>
              <div className="text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">📱</div>
            </div>
          </div>
        );
        
      case 'chaos-mode':
        return (
          <div className="absolute inset-4">
            {/* Scattered chaos elements */}
            <div className="absolute top-2 left-8 w-12 h-3 bg-red-300 rounded transform rotate-12 animate-pulse"></div>
            <div className="absolute top-12 right-6 w-8 h-3 bg-orange-300 rounded transform -rotate-6 animate-bounce"></div>
            <div className="absolute bottom-16 left-4 w-16 h-3 bg-yellow-300 rounded transform rotate-45 animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-10 h-3 bg-pink-300 rounded transform -rotate-12 animate-bounce"></div>
            {/* Center chaos emoji */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl text-red-400 animate-pulse">😵‍💫</div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">We Know This Feeling...</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch the all-too-familiar ADHD weekly cycle unfold
          </p>
        </div>

        {/* Single Animated Scenario */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Main Animation Card */}
            <div className={`bg-white rounded-3xl shadow-2xl p-12 border-4 ${currentData.borderColor} transition-all duration-1000 hover:shadow-3xl`}>
              {/* Scenario Indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {scenarios.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        index === currentScenario
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Visual Area */}
              <div className={`h-80 bg-gradient-to-br ${currentData.bgGradient} rounded-2xl mb-8 relative overflow-hidden transition-all duration-1000`}>
                {renderVisual()}
                
                {/* Overlay Labels */}
                <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-lg">
                  {currentData.emoji} {currentData.timeLabel}
                </div>
                <div className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-600 shadow-lg">
                  {currentData.statusLabel}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 transition-all duration-500">
                  {currentData.title}
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  {currentData.subtitle}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap justify-center gap-4">
                  {currentData.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 transition-all duration-300 hover:shadow-md transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ 
                        transitionDelay: `${index * 200}ms`
                      }}
                    >
                      <div className={`w-3 h-3 ${feature.color} rounded-full`}></div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">{currentData.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {currentScenario + 1} of {scenarios.length}
                  </div>
                  <div className="text-2xl animate-pulse">⏱️</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-2xl text-gray-700 mb-8">
            Sound familiar? 🙃 You're not broken - your calendar just doesn't understand you.
          </p>
          
          <button 
            onClick={() => document.getElementById('choice-texts')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            See How We Fix This →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProblemVisual; 