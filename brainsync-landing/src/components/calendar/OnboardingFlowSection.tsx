import React, { useState } from 'react';
import { 
  MessageCircle, 
  Target, 
  Brain, 
  Zap, 
  Heart, 
  Calendar,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle2,
  ArrowRight,
  Award,
  Tv
} from 'lucide-react';

const OnboardingFlowSection = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [activeExample, setActiveExample] = useState<'planning' | 'calendar' | 'support'>('calendar');

  const onboardingPhases = [
    {
      title: "Opening Conversation",
      subtitle: "Free-form goal exploration",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      duration: "5-8 minutes",
      conversation: {
        ai: "Tell me about what you want to accomplish in your life right now. Don't worry about being organized - just share what comes to mind.",
        user: "I want to grow my coaching business but also spend quality time with my son Henry. I've been working on this ADHD app and a book, but I feel scattered. I love being outdoors - camping, fishing - but I never seem to make time for it...",
        aiResponse: "I hear three important themes: business growth, family connection, and personal renewal through nature. Let's talk about what success looks like for your business in the next year..."
      }
    },
    {
      title: "Goal Architecture", 
      subtitle: "Breaking down yearly → monthly → weekly",
      icon: <Target className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      duration: "3-5 minutes",
      conversation: {
        ai: "Let's take that coaching business goal and make it concrete. What would 'growing your business' look like by this time next year?",
        user: "I'd love to have 20 regular clients, maybe launch a group program, and actually take weekends off without feeling guilty...",
        aiResponse: "Perfect! So 20 clients, a group program, and sustainable boundaries. If we work backwards, that means by March you'd need about 12 clients, which is 2-3 new clients per month. How does that feel as a monthly target?"
      }
    },
    {
      title: "ADHD Challenges",
      subtitle: "Understanding your specific struggles", 
      icon: <Brain className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      duration: "4-6 minutes",
      conversation: {
        ai: "Tell me about the ADHD-specific challenges that make planning and follow-through difficult for you.",
        user: "I make these elaborate plans on Sunday and then completely ignore them by Tuesday. I get hyperfocused on random things and forget about scheduled calls. Time just... disappears. And don't get me started on the 3am Netflix spirals when I should be sleeping...",
        aiResponse: "That's so common with ADHD brains! The hyperfocus is actually a superpower - we just need to work with it instead of against it. And those late-night spirals? That's your brain seeking dopamine when it's tired. Let's talk about how to honor those flow states while still protecting important commitments like sleep..."
      }
    },
    {
      title: "Energy Patterns",
      subtitle: "When you're at your best/worst",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500", 
      duration: "3-4 minutes",
      conversation: {
        ai: "When during the day do you feel most sharp and creative? And when do you typically crash?",
        user: "Definitely mornings, like 9-11 AM. I can think clearly and get stuff done. After lunch I'm useless until around 4 PM, then I get a second wind around 7 PM.",
        aiResponse: "Classic ADHD energy pattern! So 9-11 AM is your golden window for important work. The afternoon dip is real - that's when we'll schedule easier tasks or breaks. And that 7 PM energy spike? Perfect for creative projects or planning..."
      }
    },
    {
      title: "Joy & Balance",
      subtitle: "What energizes vs. drains you",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-500 to-red-500",
      duration: "3-5 minutes", 
      conversation: {
        ai: "What activities make you feel most alive and energized? And what consistently drains your battery?",
        user: "Being outdoors is everything - hiking, camping, fishing with Henry. Long Zoom calls kill me, and admin work makes me want to hide under a blanket.",
        aiResponse: "Your outdoor time isn't just fun - it's medicine for your ADHD brain! We need to protect that sacred. And those draining activities? We'll batch them, limit them, and always follow them with something energizing..."
      }
    },
    {
      title: "Resources & Constraints", 
      subtitle: "Your real-world situation",
      icon: <Settings className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      duration: "2-4 minutes",
      conversation: {
        ai: "Let's get real about your constraints. What are your non-negotiables? What support do you have? What's actually realistic?",
        user: "Henry comes first, always. I have some flexibility with my schedule but need to be available for client emergencies. Budget's tight but I can invest in tools that actually work.",
        aiResponse: "Henry-first is beautiful - that clarity makes everything easier. And emergency availability we can work with - it just means building in buffer time and having backup plans. The constraint breeds creativity..."
      }
    },
    {
      title: "Calendar Integration",
      subtitle: "Current calendar patterns",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-teal-500 to-green-500",
      duration: "4-6 minutes",
      conversation: {
        ai: "Tell me about your current calendar. What's working? What makes you want to throw your phone across the room?",
        user: "I block time for everything but then completely ignore the blocks. Client calls go great but I never plan transition time. I schedule back-to-back meetings and then hate myself.",
        aiResponse: "Ah, the classic 'perfect plan, terrible execution' cycle! Your instinct to block time is right - we just need to make the blocks work with your brain, not against it. Buffer time isn't optional for ADHD brains, it's medicine..."
      }
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            <span>7-Phase AI-Guided Onboarding</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Your Personalized Setup
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Conversation</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI guides you through a thoughtful conversation to understand your goals, 
            ADHD patterns, and life context. No forms, no checkboxes - just natural dialogue 
            that creates your personalized calendar approach.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Phase Navigation */}
          <div className="lg:col-span-1">
            {/* Animated Arrow Call-to-Action */}
            <div className="text-center mb-6">
              <div className="inline-flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  👇 Click to explore each conversation phase!
                </p>
                <div className="animate-bounce">
                  <svg 
                    className="w-6 h-6 text-purple-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">The Conversation Flow</h3>
            <div className="space-y-3">
              {onboardingPhases.map((phase, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhase(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    activePhase === index
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${phase.color} text-white`}>
                      {phase.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${activePhase === index ? 'text-purple-900' : 'text-gray-900'}`}>
                        {phase.title}
                      </h4>
                      <p className={`text-sm ${activePhase === index ? 'text-purple-700' : 'text-gray-600'}`}>
                        {phase.subtitle}
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${activePhase === index ? 'text-purple-600' : 'text-gray-400'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Conversation Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-xl mt-16">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Sample Conversation
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{onboardingPhases[activePhase].duration}</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* AI Message */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                      <div className="text-sm font-medium text-purple-600 mb-1">BrainSync AI</div>
                      <p className="text-gray-800">{onboardingPhases[activePhase].conversation.ai}</p>
                    </div>
                  </div>
                </div>

                {/* User Response */}
                <div className="flex items-start space-x-4 justify-end">
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md p-4 text-white">
                      <div className="text-sm font-medium text-blue-100 mb-1">You</div>
                      <p className="text-white">{onboardingPhases[activePhase].conversation.user}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">D</span>
                  </div>
                </div>

                {/* AI Follow-up */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                      <div className="text-sm font-medium text-purple-600 mb-1">BrainSync AI</div>
                      <p className="text-gray-800">{onboardingPhases[activePhase].conversation.aiResponse}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Info */}
              <div className="mt-8 bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${onboardingPhases[activePhase].color} text-white`}>
                      {onboardingPhases[activePhase].icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{onboardingPhases[activePhase].title}</h4>
                      <p className="text-sm text-gray-600">{onboardingPhases[activePhase].subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Phase {activePhase + 1} of 7</div>
                    <div className="text-xs text-gray-600">Typical Duration: {onboardingPhases[activePhase].duration}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Summary with Detailed Examples */}
        <div className="mt-20 bg-white rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              After Your Conversation
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI creates your personalized Sunday planning framework and weekly support system. 
              Here's exactly what that looks like in action:
            </p>
          </div>

          {/* Animated Arrow Call-to-Action */}
          <div className="text-center mb-8">
            <div className="inline-flex flex-col items-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                👇 Explore your personalized ADHD support system!
              </p>
              <div className="animate-bounce">
                <svg 
                  className="w-8 h-8 text-purple-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Example Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 inline-flex space-x-1 shadow-lg">
              {[
                { key: 'calendar', label: 'Calendar Integration', icon: <Calendar className="w-4 h-4" /> },
                { key: 'planning', label: 'Sunday Planning', icon: <Award className="w-4 h-4" /> },
                { key: 'support', label: 'Brain Trap Support', icon: <Heart className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveExample(tab.key as 'planning' | 'calendar' | 'support')}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeExample === tab.key
                      ? 'bg-purple-100 text-purple-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sunday Planning Example */}
          {activeExample === 'planning' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-200">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-purple-600 mr-3" />
                <h4 className="text-2xl font-bold text-gray-900">Your Sunday Planning Session</h4>
              </div>

              <div className="space-y-6">
                {/* Week Review */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-bold text-gray-900 mb-4">📊 Last Week Celebration</h5>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                          <div className="text-sm font-medium text-purple-600 mb-1">BrainSync AI</div>
                          <p className="text-gray-800">"Let's celebrate what happened last week! I see you had that big client presentation Thursday. How did it go?"</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 justify-end">
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md p-4 text-white">
                          <div className="text-sm font-medium text-blue-100 mb-1">You</div>
                          <p>"Actually amazing! I prepared differently this time - did it right after my morning workout when my brain was sharp. And I didn't schedule anything right after, so I wasn't rushing."</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">D</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                          <div className="text-sm font-medium text-purple-600 mb-1">BrainSync AI</div>
                          <p className="text-gray-800">"That's brilliant! 🎉 Post-workout + buffer time = presentation magic. Let's definitely use that pattern for your pitch next week. What else felt really good this week?"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Week Ahead Planning */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h5 className="font-bold text-blue-900 mb-4">🚀 This Week's Game Plan</h5>
                  <div className="space-y-3">
                    {[
                      "Tuesday 9:30 AM: Important client work (post-workout energy window)",
                      "Tuesday 11:30 AM: 30-min buffer/integration time",
                      "Wednesday 7:00 PM: Creative project work (evening energy spike)",
                      "Thursday: Light day (afternoon of client presentation)",
                      "Saturday morning: Henry fishing trip (energy + joy protection)"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Integration Example */}
          {activeExample === 'calendar' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-200">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h4 className="text-2xl font-bold text-gray-900">Calendar Integration in Action</h4>
              </div>

              {/* Interactive Month Progression */}
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <h5 className="text-lg font-bold text-blue-900 mb-2">📈 Your Calendar Evolution Journey</h5>
                  <p className="text-blue-700 text-sm">Click each month to see how your calendar transforms as the AI learns your patterns</p>
                </div>
                
                {/* Animated Arrow Call-to-Action */}
                <div className="text-center mb-6">
                  <div className="inline-flex flex-col items-center">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      👇 Click any month to see the evolution!
                    </p>
                    <div className="animate-bounce">
                      <svg 
                        className="w-6 h-6 text-blue-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center items-center space-x-4 text-sm">
                  <button
                    onClick={() => setActivePhase(0)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 ${
                      activePhase === 0 
                        ? 'bg-blue-500 text-white shadow-lg scale-105' 
                        : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                    <span>Month 1: Basic Structure</span>
                  </button>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                  <button
                    onClick={() => setActivePhase(1)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 ${
                      activePhase === 1 
                        ? 'bg-blue-500 text-white shadow-lg scale-105' 
                        : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                    <span>Month 2: Energy Optimization</span>
                  </button>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                  <button
                    onClick={() => setActivePhase(2)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full transition-all duration-300 ${
                      activePhase === 2 
                        ? 'bg-blue-500 text-white shadow-lg scale-105' 
                        : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                    <span>Month 3: Full ADHD Flow</span>
                  </button>
                </div>
              </div>

              {/* What Changed & AI Confirmation - Side by Side */}
              <div className="mt-8 grid lg:grid-cols-2 gap-8">
                {/* Evolution Comparison - Left Column */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <h5 className="font-bold text-gray-900 mb-4">
                    🚀 What Changed: {
                      activePhase === 0 ? 'Starting Simple' :
                      activePhase === 1 ? 'Adding Energy Optimization' :
                      'Perfecting ADHD Flow'
                    }
                  </h5>
                  
                  {activePhase === 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h6 className="font-semibold text-gray-800 mb-3">Month 1: Basic Structure</h6>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div>✓ Core deep work blocks</div>
                        <div>✓ Essential client meetings</div>
                        <div>✓ Protected family time</div>
                        <div>✓ Weekend activities</div>
                      </div>
                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-blue-800 text-sm">
                          <strong>AI Focus:</strong> Learning your basic patterns and protecting non-negotiables like Henry time.
                        </p>
                      </div>
                    </div>
                  )}

                  {activePhase === 1 && (
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h6 className="font-semibold text-blue-800 mb-3">Month 2: Energy Optimization</h6>
                      <div className="space-y-2 text-sm text-blue-700 mb-4">
                        <div>+ Morning workouts for energy</div>
                        <div>+ Buffer time after big events</div>
                        <div>+ Decompression breaks</div>
                        <div>+ Weekend wind-down rituals</div>
                        <div>+ Creative work in optimal windows</div>
                      </div>
                      <div className="bg-blue-100 rounded p-3">
                        <p className="text-blue-800 text-sm">
                          <strong>AI Learning:</strong> Recognizing your energy patterns and adding supporting activities.
                        </p>
                      </div>
                    </div>
                  )}

                  {activePhase === 2 && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-300">
                      <h6 className="font-semibold text-blue-900 mb-3">Month 3: Full ADHD Flow ⭐</h6>
                      <div className="space-y-2 text-sm text-blue-800 mb-4">
                        <div>+ Daily meditation & reflection</div>
                        <div>+ Perfect energy-activity matching</div>
                        <div>+ Social scheduling time</div>
                        <div>+ Evening wind-down routines</div>
                        <div>+ Choice-aware transitions</div>
                        <div>+ Weekly planning & review</div>
                      </div>
                      <div className="bg-blue-200 rounded p-3">
                        <p className="text-blue-900 text-sm">
                          <strong>AI Mastery:</strong> Calendar works seamlessly with your ADHD brain's unique rhythms.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 bg-blue-100 rounded-lg p-4 border border-blue-300">
                    <div className="flex items-start space-x-3">
                      <Brain className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Gradual, Sustainable Growth</p>
                        <p className="text-blue-800 text-sm">
                          Each month builds naturally on the last. BrainSync gradually adds elements as you build confidence and the AI learns your patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Confirmation Conversation - Right Column */}
                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <h5 className="font-bold text-gray-900 mb-4">💬 AI Confirmation</h5>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 shadow-sm">
                          <div className="text-xs font-medium text-blue-600 mb-1">BrainSync AI</div>
                          <p className="text-gray-800 text-sm">
                            {activePhase === 0 ? 
                              "Great! I've started with your core essentials. As I learn your patterns, I'll suggest energy-aligned additions. How does this basic structure feel?" :
                              activePhase === 1 ? 
                              "I notice you're most productive after workouts! I've added buffer time after your big presentation. Should we experiment with more morning energy blocks?" :
                              "Look how far you've come! Your calendar now flows with your ADHD brain's natural rhythms. Want to fine-tune anything for next week?"
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 justify-end">
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md p-3 text-white">
                          <div className="text-xs font-medium text-blue-100 mb-1">You</div>
                          <p className="text-sm">
                            {activePhase === 0 ? 
                              "This feels manageable! I love that you protected the fishing time with Henry. Can we add more as I get comfortable?" :
                              activePhase === 1 ? 
                              "Yes! The workout timing is perfect, and that buffer after presentations is genius. I'm not rushing anymore." :
                              "This is incredible! I actually follow my schedule now because it works WITH my brain instead of against it."
                            }
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">D</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 shadow-sm">
                          <div className="text-xs font-medium text-blue-600 mb-1">BrainSync AI</div>
                          <p className="text-gray-800 text-sm">
                            {activePhase === 0 ? 
                              "Exactly! We'll build slowly as you gain confidence. Next month I'll start suggesting energy optimizations based on what I observe. ✨" :
                              activePhase === 1 ? 
                              "That's the ADHD-friendly approach working! Next month we'll add mindfulness elements and perfect those transitions. 🧠" :
                              "That's the goal! Your calendar is now a tool that celebrates your neurodivergent superpowers instead of fighting them. Welcome to ADHD calendar mastery! 🎉"
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar View - With Added Padding */}
              <div className="mt-12 grid lg:grid-cols-5 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-5">
                  <h5 className="font-bold text-gray-900 mb-4">
                    Your Week View - {
                      activePhase === 0 ? 'Month 1 (Basic Structure)' :
                      activePhase === 1 ? 'Month 2 (Energy Optimization)' :
                      'Month 3 (Full ADHD Flow)'
                    }
                  </h5>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="relative" style={{ height: '900px' }}>
                      {/* Time ruler background */}
                      <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-300 bg-gray-100">
                        {[6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour, index) => {
                          // Fix AM/PM logic
                          let timeDisplay;
                          if (index <= 5) { // 6,7,8,9,10,11
                            timeDisplay = `${hour}:00 AM`;
                          } else { // 12,1,2,3,4,5,6,7,8,9,10
                            timeDisplay = `${hour}:00 PM`;
                          }
                          
                          return (
                            <div 
                              key={`${hour}-${index}`}
                              className="absolute text-sm text-gray-600 text-right pr-2"
                              style={{ top: `${index * 50}px`, lineHeight: '14px' }}
                            >
                              {timeDisplay}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Events positioned by time and day - Dynamic based on month */}
                      <div className="ml-20 relative">
                        {/* Day Headers at 6am level (index 0) */}
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, dayIndex) => {
                          const columnWidth = 150;
                          const leftOffset = dayIndex * (columnWidth + 8);
                          
                          return (
                            <div 
                              key={day}
                              className="absolute bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold text-center"
                              style={{ 
                                top: '0px', // At 6am level
                                left: `${leftOffset}px`,
                                width: `${columnWidth}px`,
                                zIndex: 20 
                              }}
                            >
                              {day}
                            </div>
                          );
                        })}

                        {/* Events for different months */}
                        {(() => {
                          // Month 1: Basic Structure (Blue)
                          const month1Events = [
                            // Basic work and family structure only
                            { day: 1, time: "9:00 AM", event: "Deep Work", duration: 120, startHour: 9 },
                            { day: 1, time: "2:00 PM", event: "Client Meeting", duration: 60, startHour: 14 },
                            { day: 2, time: "10:00 AM", event: "Presentation", duration: 90, startHour: 10 },
                            { day: 2, time: "3:00 PM", event: "Follow-up Calls", duration: 60, startHour: 15 },
                            { day: 4, time: "9:00 AM", event: "Project Work", duration: 120, startHour: 9 },
                            { day: 4, time: "5:00 PM", event: "Henry Pickup", duration: 30, startHour: 17 },
                            { day: 6, time: "8:00 AM", event: "Fishing w/ Henry", duration: 240, startHour: 8 }
                          ];

                          // Month 2: Energy Optimization (Blue + Lime)
                          const month2Events = [
                            // Basic structure (keep blue)
                            { day: 1, time: "9:00 AM", event: "Deep Work", duration: 120, startHour: 9 },
                            { day: 1, time: "2:00 PM", event: "Client Meeting", duration: 60, startHour: 14 },
                            { day: 2, time: "10:00 AM", event: "Presentation", duration: 90, startHour: 10 },
                            { day: 2, time: "3:00 PM", event: "Follow-up Calls", duration: 60, startHour: 15 },
                            { day: 4, time: "9:00 AM", event: "Project Work", duration: 120, startHour: 9 },
                            { day: 4, time: "5:00 PM", event: "Henry Pickup", duration: 30, startHour: 17 },
                            { day: 6, time: "8:00 AM", event: "Fishing w/ Henry", duration: 240, startHour: 8 },
                            
                            // Added energy-aligned elements (lime - indexes 7-14)
                            { day: 1, time: "7:00 AM", event: "Energy Boost Workout", duration: 60, startHour: 7 },
                            { day: 1, time: "11:30 AM", event: "Transition Buffer", duration: 30, startHour: 11.5 },
                            { day: 2, time: "7:00 AM", event: "Pre-Presentation Workout", duration: 60, startHour: 7 },
                            { day: 2, time: "12:00 PM", event: "Recovery Break", duration: 60, startHour: 12 },
                            { day: 3, time: "10:00 AM", event: "Peak Energy Creative Block", duration: 120, startHour: 10 },
                            { day: 4, time: "7:30 AM", event: "Morning Energy Ritual", duration: 60, startHour: 7.5 },
                            { day: 5, time: "8:00 AM", event: "Friday Momentum Workout", duration: 60, startHour: 8 },
                            { day: 5, time: "6:00 PM", event: "Weekend Transition Wind-down", duration: 120, startHour: 18 }
                          ];

                          // Month 3: Full ADHD Flow (Blue + Lime + Purple)
                          const month3Events = [
                            // Basic structure (keep blue - indexes 0-6)
                            { day: 1, time: "9:00 AM", event: "Deep Work", duration: 120, startHour: 9 },
                            { day: 1, time: "2:00 PM", event: "Client Meeting", duration: 60, startHour: 14 },
                            { day: 2, time: "10:00 AM", event: "Presentation", duration: 90, startHour: 10 },
                            { day: 2, time: "3:00 PM", event: "Follow-up Calls", duration: 60, startHour: 15 },
                            { day: 4, time: "9:00 AM", event: "Project Work", duration: 120, startHour: 9 },
                            { day: 4, time: "5:00 PM", event: "Henry Pickup", duration: 30, startHour: 17 },
                            { day: 6, time: "8:00 AM", event: "Fishing w/ Henry", duration: 240, startHour: 8 },
                            
                            // Energy-aligned elements (keep lime - indexes 7-14)
                            { day: 1, time: "7:00 AM", event: "Energy Boost Workout", duration: 60, startHour: 7 },
                            { day: 1, time: "11:30 AM", event: "Transition Buffer", duration: 30, startHour: 11.5 },
                            { day: 2, time: "7:00 AM", event: "Pre-Presentation Workout", duration: 60, startHour: 7 },
                            { day: 2, time: "12:00 PM", event: "Recovery Break", duration: 60, startHour: 12 },
                            { day: 3, time: "10:00 AM", event: "Peak Energy Creative Block", duration: 120, startHour: 10 },
                            { day: 4, time: "7:30 AM", event: "Morning Energy Ritual", duration: 60, startHour: 7.5 },
                            { day: 5, time: "8:00 AM", event: "Friday Momentum Workout", duration: 60, startHour: 8 },
                            { day: 5, time: "6:00 PM", event: "Weekend Transition Wind-down", duration: 120, startHour: 18 },
                            
                            // AI-optimized mindfulness and transition elements (purple - indexes 15+)
                            { day: 0, time: "8:00 AM", event: "🧘 Mindful Week Preparation", duration: 30, startHour: 8 },
                            { day: 0, time: "10:00 AM", event: "🎯 AI-Guided Weekly Planning", duration: 90, startHour: 10 },
                            { day: 0, time: "2:00 PM", event: "💚 Quality Father-Son Connection", duration: 180, startHour: 14 },
                            { day: 0, time: "9:00 PM", event: "🌙 Gentle Evening Flow", duration: 60, startHour: 21 },
                            { day: 1, time: "7:30 PM", event: "🤝 Dopamine-Safe Social Check", duration: 45, startHour: 19.5 },
                            { day: 1, time: "9:00 PM", event: "📚 ADHD-Friendly Reading Ritual", duration: 60, startHour: 21 },
                            { day: 3, time: "3:00 PM", event: "📅 Strategic Social Scheduling", duration: 60, startHour: 15 },
                            { day: 3, time: "7:00 PM", event: "🧘 Grounding Evening Meditation", duration: 30, startHour: 19 },
                            { day: 3, time: "8:30 PM", event: "🌊 Brain-Soothing Wind-down", duration: 90, startHour: 20.5 },
                            { day: 4, time: "7:00 PM", event: "🍽️ Nourishing Family Connection", duration: 90, startHour: 19 },
                            { day: 4, time: "9:00 PM", event: "✨ Passion Project Flow Time", duration: 60, startHour: 21 },
                            { day: 5, time: "9:30 AM", event: "🎉 Weekly Wins Celebration", duration: 60, startHour: 9.5 },
                            { day: 6, time: "8:00 PM", event: "💭 Weekend Reflection Ritual", duration: 60, startHour: 20 }
                          ];

                          const currentEvents = activePhase === 0 ? month1Events : 
                                              activePhase === 1 ? month2Events : month3Events;

                          return currentEvents.map((item, index) => {
                            const topPosition = (item.startHour - 6) * 50 + 30; // +30 to account for day header
                            const height = (item.duration / 60) * 50;
                            const columnWidth = 150;
                            const leftOffset = item.day * (columnWidth + 8);
                            
                            // Determine color based on month and event index
                            let colorClass = "bg-blue-500 text-white"; // Default blue
                            
                            if (activePhase === 1) { // Month 2
                              if (index >= 7) { // New energy-optimization events
                                colorClass = "bg-lime-500 text-white";
                              }
                            } else if (activePhase === 2) { // Month 3
                              if (index >= 15) { // AI-optimized events
                                colorClass = "bg-purple-500 text-white";
                              } else if (index >= 7) { // Energy-optimization events
                                colorClass = "bg-lime-500 text-white";
                              }
                            }
                            
                            return (
                              <div key={`${activePhase}-${index}`} className="transition-all duration-500">
                                {/* Event block - Different colors by month */}
                                <div 
                                  className={`absolute rounded-lg p-3 shadow-md ${colorClass} overflow-hidden`}
                                  style={{ 
                                    top: `${topPosition}px`, 
                                    left: `${leftOffset}px`,
                                    height: `${Math.max(height, 70)}px`,
                                    width: `${columnWidth}px`,
                                    zIndex: 10 
                                  }}
                                >
                                  <div className="text-xs font-bold">{item.time}</div>
                                  <div className="text-xs opacity-90 mt-1 font-medium leading-tight">{item.event}</div>
                                  <div className="text-xs opacity-75 mt-1">{item.duration}min</div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Support Example */}
          {activeExample === 'support' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-pink-200">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-pink-600 mr-3" />
                <h4 className="text-2xl font-bold text-gray-900">Weekly Support System</h4>
              </div>

              <div className="space-y-8">
                {/* Interactive Phone Timeline */}
                <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h5 className="text-2xl font-bold text-white mb-2">From 3AM Netflix Spirals to Conscious Sleep Choices</h5>
                    <p className="text-indigo-200 mb-8">Follow the timeline through a real evening...</p>
                  </div>

                  <div className="text-center mb-8">
                    <h5 className="text-xl font-bold text-white mb-2">Your Choice Journey</h5>
                  </div>

                  {/* Timeline Navigation */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 inline-flex space-x-1">
                      {[
                        { time: '10:30 PM', label: 'First Nudge', active: activePhase === 0 },
                        { time: '11:45 PM', label: 'Follow-up', active: activePhase === 1 },
                        { time: '7:30 AM', label: 'Celebration', active: activePhase === 2 }
                      ].map((step, index) => (
                        <button
                          key={index}
                          onClick={() => setActivePhase(index)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            activePhase === index
                              ? 'bg-white text-indigo-900 shadow-lg'
                              : 'text-indigo-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="font-bold">{step.time}</div>
                          <div className="text-xs opacity-75">{step.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Helper Animation */}
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-3 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/30">
                      <Brain className="w-4 h-4 text-blue-300 animate-pulse" />
                      <span className="text-blue-200 text-sm">
                        {activePhase < 2 ? 'Click the timeline to see what happens next' : 'See how the choice journey completes!'}
                      </span>
                      {activePhase < 2 && (
                        <ArrowRight className="w-4 h-4 text-blue-300 animate-bounce" />
                      )}
                    </div>
                  </div>

                  {/* Phone Screen Container */}
                  <div className="flex justify-center mb-16">
                    <div className="relative">
                      {/* 10:30 PM - First Nudge */}
                      {activePhase === 0 && (
                        <div className="animate-fade-in">
                          <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl w-80 h-[650px] mx-auto overflow-hidden">
                            {/* Phone Header */}
                            <div className="bg-black rounded-2xl p-1 mb-1">
                              <div className="bg-gray-900 rounded-xl px-4 py-3">
                                <div className="flex items-center justify-between text-white text-sm">
                                  <span className="font-medium">10:30 PM</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="text-xs">100%</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Message Screen */}
                            <div className="bg-white rounded-2xl p-3 h-[570px] flex flex-col overflow-hidden">
                              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">BrainSync</div>
                                  <div className="text-xs text-green-600">● Active now</div>
                                </div>
                              </div>

                              <div className="space-y-3 flex-1 overflow-y-auto">
                                {/* AI Message */}
                                <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3">
                                  <p className="text-gray-800 text-sm">Hey! I notice it's 10:30 PM and you mentioned those late-night Netflix spirals in our chat. You have that important client presentation tomorrow at 10:30 AM.</p>
                                  <p className="text-gray-800 text-sm mt-2">Right now you get to make a conscious choice: 🌙</p>
                                </div>

                                {/* Reply Options */}
                                <div className="space-y-2">
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">1. 😴 Choose sleep</div>
                                    <div className="text-xs text-blue-700">Honor tomorrow's presentation + morning energy</div>
                                  </button>
                                  
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">2. 📺 One episode with timer</div>
                                    <div className="text-xs text-blue-700">45-min limit to protect sleep</div>
                                  </button>
                                  
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">3. 📖 Something gentler</div>
                                    <div className="text-xs text-blue-700">Journal, read, or soft music</div>
                                  </button>
                                </div>

                                <div className="text-center mt-auto pt-2">
                                  <p className="text-xs text-gray-500">Whatever you choose, I'm celebrating that you're making it consciously! 💚</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 11:45 PM - When Ignored */}
                      {activePhase === 1 && (
                        <div className="animate-fade-in">
                          <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl w-80 h-[650px] mx-auto overflow-hidden">
                            {/* Phone Header */}
                            <div className="bg-black rounded-2xl p-1 mb-1">
                              <div className="bg-gray-900 rounded-xl px-4 py-3">
                                <div className="flex items-center justify-between text-white text-sm">
                                  <span className="font-medium">11:45 PM</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="text-xs">89%</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Message Screen */}
                            <div className="bg-white rounded-2xl p-3 h-[570px] flex flex-col overflow-hidden">
                              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">BrainSync</div>
                                  <div className="text-xs text-green-600">● Active now</div>
                                </div>
                              </div>

                              <div className="space-y-3 flex-1 overflow-y-auto">
                                {/* Original message (smaller) */}
                                <div className="bg-gray-50 rounded-xl p-2 opacity-70">
                                  <p className="text-gray-600 text-xs">🌙 Sleep choice check-in from 10:30 PM</p>
                                </div>

                                {/* Follow-up message */}
                                <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3">
                                  <p className="text-gray-800 text-sm">Hey, I see you're still up! 👀 </p>
                                  <p className="text-gray-800 text-sm mt-2">Plot twist: I'm not going to sleep right now either. The late-night brain wants what it wants! 🧠✨</p>
                                  <p className="text-gray-800 text-sm mt-2">No judgment here - just checking: are you <em>choosing</em> this Netflix time, or did your brain just kinda... drift here? 🤔</p>
                                </div>

                                {/* Reply Options */}
                                <div className="space-y-2">
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">1. 🎯 I'm choosing this!</div>
                                    <div className="text-xs text-blue-700">Conscious Netflix time = valid choice</div>
                                  </button>
                                  
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">2. 😅 Brain drift happened</div>
                                    <div className="text-xs text-blue-700">Let's get back on track</div>
                                  </button>
                                  
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">3. 🤐 Leave me alone</div>
                                    <div className="text-xs text-blue-700">I got this, thanks</div>
                                  </button>
                                </div>

                                <div className="text-center mt-auto pt-2">
                                  <p className="text-xs text-gray-500">Either way, you're building choice awareness! 🎉</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 7:30 AM - Next Morning Celebration */}
                      {activePhase === 2 && (
                        <div className="animate-fade-in">
                          <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl w-80 h-[650px] mx-auto overflow-hidden">
                            {/* Phone Header */}
                            <div className="bg-black rounded-2xl p-1 mb-1">
                              <div className="bg-gray-900 rounded-xl px-4 py-3">
                                <div className="flex items-center justify-between text-white text-sm">
                                  <span className="font-medium">7:30 AM</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="text-xs">100%</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Message Screen */}
                            <div className="bg-white rounded-2xl p-3 h-[570px] flex flex-col overflow-hidden">
                              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">BrainSync</div>
                                  <div className="text-xs text-green-600">● Active now</div>
                                </div>
                              </div>

                              <div className="space-y-3 flex-1 overflow-y-auto">
                                {/* Celebration Message */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                                  <p className="text-green-800 text-sm">Good morning! ☀️ I saw you chose sleep at 10:30 PM last night. That was a powerful conscious choice! 🎉</p>
                                  <p className="text-green-800 text-sm mt-2">How are you feeling this morning? Ready to crush that presentation? 💪</p>
                                </div>

                                {/* Reply Options */}
                                <div className="space-y-2">
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">1. 🚀 Feeling great!</div>
                                  </button>
                                  
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">2. 😴 Still tired but better</div>
                                  </button>
                                  
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-2 text-left transition-colors border border-blue-200">
                                    <div className="font-medium text-blue-800 text-sm">3. 😬 Nervous about presentation</div>
                                  </button>
                                </div>

                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-2 border border-yellow-200 mt-auto">
                                  <p className="text-yellow-800 text-xs text-center">These moments of awareness are building your choice-making muscle. Each time gets easier! 💚</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Before/After Side by Side - Centered Under Phone */}
                  <div className="px-8">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                      {/* Before */}
                      <div className="px-6">
                        <h6 className="font-bold text-white mb-6 flex items-center text-lg">
                          <Tv className="w-5 h-5 mr-3" />
                          Before BrainSync
                        </h6>
                        <div className="space-y-4 text-white">
                          <p>🕚 10:30 PM: "Just one more episode..."</p>
                          <p>🕛 11:30 PM: Still scrolling, feeling guilty</p>
                          <p>🕐 1:00 AM: "I should really sleep..."</p>
                          <p>🕒 3:00 AM: Finally sleep, feeling terrible</p>
                          <p>😴 Next day: Exhausted, repeat cycle</p>
                        </div>
                      </div>

                      {/* After */}
                      <div className="px-6 pl-20">
                        <h6 className="font-bold text-white mb-6 flex items-center text-lg">
                          <CheckCircle2 className="w-5 h-5 mr-3" />
                          With BrainSync
                        </h6>
                        <div className="space-y-4 text-white">
                          <p>🕚 10:30 PM: Gentle nudge arrives</p>
                          <p>🤔 "I can choose sleep or Netflix"</p>
                          <p>😌 Choose sleep, feel proud</p>
                          <p>🌅 Wake up refreshed</p>
                          <p>🎉 Get celebration for conscious choice</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom padding */}
                    <div className="h-12"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Insight */}
          <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
            <div className="text-center">
              <Brain className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-yellow-900 mb-4">The Magic of Conscious Choice</h4>
              <p className="text-lg text-yellow-800 max-w-3xl mx-auto">
                We don't judge your choices - we celebrate that you're making them consciously. 
                The 3AM Netflix spiral happens when you're on autopilot. Our gentle nudges bring you back to 
                awareness so you can choose what actually serves you in that moment.
                <span className="font-bold"> Awareness + Choice = Freedom from patterns that don't serve you.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingFlowSection; 