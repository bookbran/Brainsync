import React, { useState } from 'react';
import { Calendar, Clock, Target, Heart, Zap, Smile, Brain, MessageCircle, Sparkles, Trophy, ArrowRight, ChevronLeft, ChevronRight, Mail, RefreshCw } from 'lucide-react';

const CalendarHeroSection = () => {
  const [activePreview, setActivePreview] = useState(0);
  const [messagingVersion, setMessagingVersion] = useState<'new' | 'old'>('new');

  // Old messaging for comparison
  const oldMessaging = {
    badge: "Calendar + AI Nudges for ADHD",
    headline: "Plan Your Week, Actually Follow It",
    subheadline: "We help people with ADHD populate a calendar that gets smarter over time, make better conscious choices throughout the week, and celebrate every decision you make (yes, even the \"creative\" ones 😉). Transform your Sunday planning from overwhelming to empowering.",
    realityCheck: {
      title: "The ADHD Reality Check:",
      text: "Making the perfect schedule is easy. Following it? That's where we shine. Our AI celebrates your wins, adapts when life happens, and never judges your \"creative interpretations\" of the plan."
    },
    features: [
      { icon: Clock, title: "Sunday Planning", subtitle: "That actually makes sense" },
      { icon: Zap, title: "Smart Nudges", subtitle: "Text magic all week" },
      { icon: Heart, title: "Choice Celebration", subtitle: "Every decision honored" },
      { icon: Target, title: "No Judgment Zone", subtitle: "Plans evolve, that's fine" }
    ],
    cta1: "Start Your Sunday Revolution",
    cta2: "See the Magic in Action"
  };

  // New messaging
  const newMessaging = {
    badge: "The Calendar Revolution for ADHD Brains",
    headline: "What If Your Calendar Actually Understood ADHD?",
    subheadline: "We know you've got 47 browser tabs open and three half-finished projects calling your name. Our AI builds calendars through conversation, gets you out of brain traps, helps you task-switch like a pro, and celebrates every choice you make (yes, even the questionable ones 😅). Finally, a calendar that works WITH your beautiful, chaotic brain.",
    realityCheck: {
      title: "The ADHD Reality Check:",
      text: "Traditional calendars assume you'll stick to the plan. Ours assume you WON'T - and that's perfectly fine! We celebrate hyperfocus spirals, honor energy crashes, help you escape endless scroll traps, and turn task-switching from chaos into your secret superpower."
    },
    features: [
      { icon: Brain, title: "Brain Trap Escape", subtitle: "Gentle nudges out of doom-scrolling" },
      { icon: Zap, title: "Smart Task Switching", subtitle: "Learns how you work best" },
      { icon: Heart, title: "All Choices Celebrated", subtitle: "Even the \"creative\" ones" },
      { icon: Sparkles, title: "Gets Smarter Daily", subtitle: "Adapts to your patterns" }
    ],
    cta1: "Join the Calendar Revolution",
    cta2: "See How It Gets You"
  };

  const currentMessaging = messagingVersion === 'new' ? newMessaging : oldMessaging;

  const previewFeatures = [
    {
      title: "Opening Conversation",
      subtitle: "Free-form goal exploration",
      time: "2:15",
      content: {
        messages: [
          {
            type: "ai",
            text: "Tell me about what you want to accomplish in your life right now. Don't worry about being organized - just share what comes to mind."
          },
          {
            type: "user", 
            text: "I want to grow my coaching business but also spend quality time with my son Henry. I feel scattered between work and family..."
          },
          {
            type: "ai",
            text: "I hear two important themes: business growth and family connection. Let's explore what success looks like for both..."
          }
        ]
      }
    },
    {
      title: "ADHD Brain Trap Support",
      subtitle: "Late night nudge intervention",
      time: "10:30",
      content: {
        time: "10:30 PM",
        messages: [
          {
            type: "ai",
            text: "Hey! I notice it's 10:30 PM and you mentioned those late-night Netflix spirals. You have that important presentation tomorrow."
          },
          {
            type: "ai",
            text: "Right now you get to make a conscious choice: 🌙"
          },
          {
            type: "options",
            choices: [
              { emoji: "😴", text: "Choose sleep", desc: "Honor tomorrow's presentation" },
              { emoji: "📺", text: "One episode with timer", desc: "45-min limit" },
              { emoji: "📖", text: "Something gentler", desc: "Journal or soft music" }
            ]
          }
        ]
      }
    },
    {
      title: "Calendar Integration",
      subtitle: "AI builds your calendar as you chat",
      time: "9:41",
      content: {
        isCalendar: true,
        events: [
          { time: "9:00 AM", title: "Morning Workout", duration: 60, step: 1 },
          { time: "10:30 AM", title: "Client Presentation", duration: 90, step: 2 },
          { time: "2:00 PM", title: "Henry's School Pickup", duration: 30, step: 3 }
        ],
        chatMessage: "I need to present to that big client, pick up Henry from school, and get some creative work done.",
        mentalHealthGap: { after: "12:00 PM", duration: 120 } // 2 hours from 12pm to 2pm
      }
    },
    {
      title: "Smart Rescheduling", 
      subtitle: "One-click calendar optimization",
      time: "11:22",
      content: {
        isCalendarAfter: true,
        events: [
          { time: "9:00 AM", title: "Morning Workout", duration: 60 },
          { time: "10:30 AM", title: "Client Presentation", duration: 90 },
          { time: "2:00 PM", title: "Henry's School Pickup", duration: 30 }
        ],
        rescheduledInfo: {
          optimizations: ["Mental health gaps preserved", "Energy patterns respected", "Buffer time automatically added"]
        },
        mentalHealthGap: { after: "12:00 PM", duration: 120 } // 2 hours from 12pm to 2pm
      }
    },
    {
      title: "Sunday Planning",
      subtitle: "AI-guided celebration & planning",
      time: "1:45",
      content: {
        messages: [
          {
            type: "ai",
            text: "Let's celebrate last week! I see you had that presentation Thursday. How did it go?"
          },
          {
            type: "user",
            text: "Actually amazing! I used my morning energy and built in buffer time."
          },
          {
            type: "ai",
            text: "🎉 That's brilliant! Post-workout + buffer time = presentation magic. Let's use that pattern for next week..."
          }
        ]
      }
    },
    {
      title: "Monday Email",
      subtitle: "Weekly game plan delivery", 
      time: "8:07",
      content: {
        isEmail: true,
        subject: "Your Week Ahead - Let's Make It Happen! 🚀",
        preview: "Hey! Ready for an amazing week? Based on our Sunday chat, here's your personalized game plan...",
        highlights: [
          "🏆 Last Week Win: Presentation mastery",
          "⚡ Energy Pattern: Post-workout power hours", 
          "🎯 This Week Focus: Client outreach + Henry time",
          "🛡️ Protected: Saturday morning fishing trip"
        ]
      }
    }
  ];

  const nextPreview = () => {
    setActivePreview((prev) => (prev + 1) % previewFeatures.length);
  };

  const prevPreview = () => {
    setActivePreview((prev) => (prev - 1 + previewFeatures.length) % previewFeatures.length);
  };

  // Function to set active preview directly
  const setPreview = (index: number) => {
    setActivePreview(index);
  };

  const currentFeature = previewFeatures[activePreview];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-adhd-light via-white to-blue-50 pt-20 pb-24">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Messaging Version Toggle */}
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Hero Messaging:</span>
              <button
                onClick={() => setMessagingVersion('old')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  messagingVersion === 'old' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">Old (Sunday Planning)</span>
              </button>
              <RefreshCw className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => setMessagingVersion('new')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  messagingVersion === 'new' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm">New (ADHD-focused)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Goodberry Logo/Image */}
              <div className="flex justify-center lg:justify-start mb-6">
                <img 
                  src="/goodberry.png" 
                  alt="Goodberry - BrainSync Pro" 
                  className="h-16 w-auto md:h-20 lg:h-24 object-contain drop-shadow-lg"
                />
              </div>
              
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>{currentMessaging.badge}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {messagingVersion === 'new' ? (
                  <>
                    What If Your Calendar
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Actually Understood ADHD?</span>
                  </>
                ) : (
                  <>
                    Plan Your Week,
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Actually Follow It</span>
                  </>
                )}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {currentMessaging.subheadline}
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-l-4 border-yellow-400">
              <div className="flex items-start space-x-3">
                <Smile className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-1">{currentMessaging.realityCheck.title}</h3>
                  <p className="text-yellow-800">
                    {currentMessaging.realityCheck.text}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentMessaging.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
                {currentMessaging.cta1}
              </button>
              <button className="border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                {currentMessaging.cta2}
              </button>
            </div>
          </div>

          {/* Right Column - Interactive Phone Demo */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-8">
                {/* Navigation Header */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-5 py-3 rounded-full text-lg font-medium mb-8">
                    <Sparkles className="w-5 h-5" />
                    <span>Interactive Demo</span>
                  </div>
                  
                  {/* Feature Navigation */}
                  <div className="flex items-center justify-between mb-8">
                    <button 
                      onClick={prevPreview}
                      className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="w-7 h-7 text-gray-600" />
                    </button>
                    
                    <div className="text-center flex-1">
                      <h3 className="text-3xl font-bold text-gray-900">{currentFeature.title}</h3>
                      <p className="text-gray-600 text-xl mt-2">{currentFeature.subtitle}</p>
                    </div>
                    
                    <button 
                      onClick={nextPreview}
                      className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-7 h-7 text-gray-600" />
                    </button>
                  </div>

                  {/* Feature Dots */}
                  <div className="flex justify-center space-x-3 mb-8">
                    {previewFeatures.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPreview(index)}
                        className={`w-4 h-4 rounded-full transition-colors ${
                          index === activePreview ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Phone Screen Mockup */}
                <div className="bg-gray-900 rounded-3xl p-4 shadow-xl">
                  <div className="bg-white rounded-2xl p-4 h-[56rem] flex flex-col">
                    
                    {/* Phone Status Bar */}
                    <div className="flex items-center justify-between px-2 py-2 mb-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-semibold text-gray-900">{currentFeature.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {/* Signal bars */}
                        <div className="flex items-end space-x-1">
                          <div className="w-1 h-2 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
                        </div>
                        {/* WiFi icon */}
                        <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {/* Battery */}
                        <div className="flex items-center">
                          <div className="w-6 h-3 border border-gray-900 rounded-sm relative">
                            <div className="w-4 h-1.5 bg-gray-900 rounded-xs absolute top-0.5 left-0.5"></div>
                          </div>
                          <div className="w-0.5 h-1.5 bg-gray-900 rounded-r-sm ml-0.5"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Area - Simplified for now */}
                    <div className="flex-1 flex items-center justify-center text-gray-600">
                      <div className="text-center">
                        <h4 className="text-xl font-semibold mb-2">{currentFeature.title}</h4>
                        <p className="text-lg">{currentFeature.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarHeroSection; 