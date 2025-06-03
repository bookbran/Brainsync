import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Heart, 
  CheckCircle2, 
  Lightbulb,
  Brain,
  Star,
  ArrowRight,
  Zap,
  Trophy
} from 'lucide-react';

const CalendarEvolutionSection = () => {
  const [activeMonth, setActiveMonth] = useState(0);

  const monthEvolution = [
    {
      month: "Week 1-2",
      title: "Starting Your Journey",
      subtitle: "Basic calendar + gentle AI support",
      intelligence: 25,
      choiceQuality: 30,
      celebration: 20,
      features: [
        "AI learns your energy patterns",
        "Simple time blocking begins", 
        "First gentle nudges arrive",
        "Basic choice awareness building"
      ],
      sample: {
        event: "9:00 AM - Deep Work",
        nudge: "💡 Hey! Notice you work best in mornings. Want to protect this time?",
        choice: "You chose to keep this slot sacred",
        celebration: "🎉 Smart move! Your morning focus is powerful."
      }
    },
    {
      month: "Month 1-2",
      title: "Building Intelligence",
      subtitle: "Calendar learns your patterns",
      intelligence: 60,
      choiceQuality: 55,
      celebration: 50,
      features: [
        "AI suggests optimal time blocks",
        "Energy-aware scheduling kicks in",
        "Choice prompts get personalized", 
        "Pattern recognition improves"
      ],
      sample: {
        event: "2:00 PM - Admin Work",
        nudge: "🤔 This used to drain you. Try batching with music?",
        choice: "You bundled 3 admin tasks together",
        celebration: "💪 Brilliant batching! You're getting efficient."
      }
    },
    {
      month: "Month 3-6",
      title: "Mastering Your Rhythm", 
      subtitle: "Intelligent calendar optimization",
      intelligence: 85,
      choiceQuality: 80,
      celebration: 85,
      features: [
        "Predictive schedule adjustments",
        "Advanced choice architecture",
        "Celebration becomes automatic",
        "Calendar adapts to life changes"
      ],
      sample: {
        event: "Flexible Creative Block",
        nudge: "🎨 Your creative energy is peaking. Protect or pivot?",
        choice: "You honored the flow state",
        celebration: "✨ That's mastery! You're reading your own energy like a pro."
      }
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Calendar Intelligence Evolution</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Calendar Gets Smarter,
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> You Get Stronger</span>
          </h2>
          
          <p className="text-xl text-indigo-200 max-w-4xl mx-auto">
            Watch how BrainSync transforms from a simple calendar tool into your personal ADHD success system. 
            Every week builds on the last, creating a custom-fitted approach that actually works with your brain.
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 inline-flex space-x-1">
            {monthEvolution.map((period, index) => (
              <button
                key={index}
                onClick={() => setActiveMonth(index)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeMonth === index
                    ? 'bg-white text-indigo-900 shadow-lg'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="font-bold">{period.month}</div>
                <div className="text-xs opacity-75">{period.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Intelligence Metrics */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                {monthEvolution[activeMonth].title}
              </h3>
              <p className="text-indigo-200 mb-8">{monthEvolution[activeMonth].subtitle}</p>

              {/* Progress Bars */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Calendar Intelligence</span>
                    </div>
                    <span className="text-blue-400 font-bold">{monthEvolution[activeMonth].intelligence}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${monthEvolution[activeMonth].intelligence}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Choice Quality</span>
                    </div>
                    <span className="text-green-400 font-bold">{monthEvolution[activeMonth].choiceQuality}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${monthEvolution[activeMonth].choiceQuality}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-pink-400" />
                      <span className="text-white font-medium">Self-Celebration</span>
                    </div>
                    <span className="text-pink-400 font-bold">{monthEvolution[activeMonth].celebration}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-pink-400 to-rose-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${monthEvolution[activeMonth].celebration}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">What's Happening:</h4>
                <div className="space-y-3">
                  {monthEvolution[activeMonth].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                      <span className="text-indigo-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Real Example */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Real Example from {monthEvolution[activeMonth].month}</h4>
              
              {/* Calendar Event */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Calendar View</span>
                </div>
                
                {/* Time-based calendar view */}
                <div className="relative bg-white rounded-lg p-3" style={{ height: '160px' }}>
                  {/* Time ruler */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-gray-200 bg-gray-50">
                    {[9, 10, 11, 12].map((hour, index) => (
                      <div 
                        key={hour} 
                        className="absolute text-xs text-gray-500 text-right pr-1"
                        style={{ top: `${index * 35}px`, lineHeight: '12px' }}
                      >
                        {hour}:00
                      </div>
                    ))}
                  </div>
                  
                  {/* Event block */}
                  <div className="ml-14 relative">
                    <div 
                      className="absolute left-0 right-8 bg-blue-500 text-white text-xs rounded-md p-2 shadow-sm"
                      style={{ 
                        top: '35px', // 9 AM + 1 hour = 10 AM position, increased scale
                        height: '70px', // 2 hour duration with increased scale
                        zIndex: 10 
                      }}
                    >
                      <div className="font-medium">{monthEvolution[activeMonth].sample.event}</div>
                      <div className="opacity-90 text-xs mt-1">Deep focus time</div>
                    </div>
                    
                    {/* Mental health gap */}
                    <div 
                      className="absolute right-0 flex items-center"
                      style={{ 
                        top: '110px', // Adjusted for increased scale
                        height: '20px',
                        zIndex: 5 
                      }}
                    >
                      <div className="flex items-center space-x-1 bg-green-50 rounded px-2 py-1 text-green-600 border border-green-200">
                        <span className="text-xs">✨ gap preserved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Nudge */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-900">AI Nudge</span>
                </div>
                <p className="text-purple-800">{monthEvolution[activeMonth].sample.nudge}</p>
              </div>

              {/* Your Choice */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Your Choice</span>
                </div>
                <p className="text-green-800">{monthEvolution[activeMonth].sample.choice}</p>
              </div>

              {/* Celebration */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Celebration</span>
                </div>
                <p className="text-yellow-800">{monthEvolution[activeMonth].sample.celebration}</p>
              </div>
            </div>

            {/* Evolution Arrow */}
            {activeMonth < monthEvolution.length - 1 && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  <span className="text-sm">Builds into</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              The Magic Is in the Evolution
            </h3>
            <p className="text-lg text-indigo-200 mb-6">
              Every ADHD brain is unique. BrainSync doesn't force you into someone else's system - 
              it learns YOUR patterns, celebrates YOUR choices, and builds a calendar that actually serves YOUR life.
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-300 transition-all transform hover:scale-105 shadow-lg">
              Start Building Your Smart Calendar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarEvolutionSection; 