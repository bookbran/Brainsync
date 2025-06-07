import React, { useState } from 'react';
import { Calendar, Clock, Target, Heart, Zap, Smile, Brain, MessageCircle, Sparkles, Trophy, ArrowRight, ChevronLeft, ChevronRight, Mail, Mic, Send } from 'lucide-react';

const CalendarHeroSection = () => {
  const [activePreview, setActivePreview] = useState(0);

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

  // Messaging content - ADHD-focused approach
  const messaging = {
    badge: "The Calendar Revolution for ADHD Brains",
    headline: "What If Your Calendar",
    headlineHighlight: " Actually Understood ADHD?",
    subheadline: "We have ADHD too and we know you've got 47 browser tabs open and three half-finished projects calling your name. Our AI builds calendars through conversation, gets you out of brain traps, helps you task-switch like a pro, and celebrates every choice you make (yes, even the questionable ones 😅). Finally, a calendar that works WITH your beautiful, chaotic brain.",
    realityCheck: {
      title: "Traditional calendars assume you'll stick to the plan. Ours assume you WON'T - and that's perfectly fine!",
      content: "We celebrate hyperfocus spirals, honor energy crashes, help you escape endless scroll traps, and turn task-switching from chaos into your secret superpower."
    },
    features: [
      { icon: Brain, title: "Brain Trap Escape", desc: "Gentle nudges out of doom-scrolling" },
      { icon: Zap, title: "Smart Task Switching", desc: "Learns how you work best" },
      { icon: Heart, title: "All Choices Celebrated", desc: "Even the 'creative' ones" },
      { icon: Sparkles, title: "Gets Smarter Daily", desc: "Adapts to your patterns" }
    ],
    cta1: "Join the Calendar Revolution",
    cta2: "See How It Gets You"
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-adhd-light via-white to-blue-50 pt-20 pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
          {/* Left Column - Text Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 lg:px-4 lg:py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span className="text-xs sm:text-sm">{messaging.badge}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                {messaging.headline}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{messaging.headlineHighlight}</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                {messaging.subheadline}
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 lg:p-6 border-l-4 border-yellow-400">
              <div className="flex items-start space-x-3">
                <Smile className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-1 text-sm lg:text-base">{messaging.realityCheck.title}</h3>
                  <p className="text-yellow-800 text-sm lg:text-base">
                    {messaging.realityCheck.content}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {messaging.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{feature.title}</h3>
                    <p className="text-xs lg:text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg text-sm lg:text-base">
                {messaging.cta1}
              </button>
              <button className="border-2 border-purple-300 text-purple-700 px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm lg:text-base">
                {messaging.cta2}
              </button>
            </div>
          </div>

          {/* Right Column - Interactive Phone Demo */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-8 border border-gray-100">
              <div className="space-y-6 lg:space-y-8">
                {/* Navigation Header */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 lg:px-5 lg:py-3 rounded-full text-sm lg:text-lg font-medium mb-6 lg:mb-8">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Interactive Demo</span>
                  </div>
                  
                  {/* Feature Navigation */}
                  <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <button 
                      onClick={prevPreview}
                      className="p-2 lg:p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 lg:w-7 lg:h-7 text-gray-600" />
                    </button>
                    
                    <div className="text-center flex-1 px-2">
                      <h3 className="text-lg lg:text-3xl font-bold text-gray-900">{currentFeature.title}</h3>
                      <p className="text-gray-600 text-sm lg:text-xl mt-1 lg:mt-2">{currentFeature.subtitle}</p>
                    </div>
                    
                    <button 
                      onClick={nextPreview}
                      className="p-2 lg:p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 lg:w-7 lg:h-7 text-gray-600" />
                    </button>
                  </div>

                  {/* Feature Dots */}
                  <div className="flex justify-center space-x-2 lg:space-x-3 mb-6 lg:mb-8">
                    {previewFeatures.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPreview(index)}
                        className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-colors ${
                          index === activePreview ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Phone Screen Mockup */}
                <div className="bg-gray-900 rounded-3xl p-3 lg:p-4 shadow-xl">
                  <div className="bg-white rounded-2xl p-3 lg:p-4 h-[32rem] sm:h-[40rem] lg:h-[56rem] flex flex-col">
                    
                    {/* Phone Status Bar */}
                    <div className="flex items-center justify-between px-2 py-2 mb-3 lg:mb-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm lg:text-lg font-semibold text-gray-900">{currentFeature.time}</span>
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
                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {/* Battery */}
                        <div className="flex items-center">
                          <div className="w-5 h-2 lg:w-6 lg:h-3 border border-gray-900 rounded-sm relative">
                            <div className="w-3 h-1 lg:w-4 lg:h-1.5 bg-gray-900 rounded-xs absolute top-0.5 left-0.5"></div>
                          </div>
                          <div className="w-0.5 h-1 lg:h-1.5 bg-gray-900 rounded-r-sm ml-0.5"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Email View */}
                    {currentFeature.content.isEmail ? (
                      <div className="space-y-3 lg:space-y-4 flex-1 min-h-0 overflow-hidden">
                        <div className="border-b border-gray-200 pb-3 lg:pb-4">
                          <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
                            <Mail className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
                            <span className="text-sm lg:text-lg font-medium text-blue-600">BrainSync Weekly</span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-lg lg:text-2xl">{currentFeature.content.subject}</h4>
                        </div>
                        <p className="text-base lg:text-xl text-gray-700 leading-relaxed">{currentFeature.content.preview}</p>
                        <div className="space-y-3 lg:space-y-4 flex-1 overflow-y-auto min-h-0">
                          {currentFeature.content.highlights.map((highlight, index) => (
                            <div key={index} className="text-sm lg:text-lg text-gray-600 bg-gray-50 rounded-lg p-3 lg:p-6 border border-gray-100">
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : currentFeature.content.isCalendar ? (
                      /* REBUILT Calendar View with Better Layout */
                      <div className="flex flex-col h-full">
                        {/* Chat showing what user said */}
                        <div className="border-b border-gray-200 pb-3 lg:pb-4 mb-3 lg:mb-4">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 lg:p-4 border border-blue-200">
                            <div className="flex items-start space-x-2 lg:space-x-3">
                              <MessageCircle className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm lg:text-lg text-blue-800 font-medium italic">"{currentFeature.content.chatMessage}"</p>
                            </div>
                          </div>
                        </div>

                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-3 lg:mb-4">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-indigo-600" />
                            <span className="text-sm lg:text-xl font-semibold text-indigo-600">Tuesday, March 12</span>
                          </div>
                          <div className="flex items-center space-x-1 lg:space-x-2">
                            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs lg:text-lg text-green-600 font-medium">Building...</span>
                          </div>
                        </div>

                        {/* Improved Calendar Layout */}
                        <div className="flex-1 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-2 lg:p-4 overflow-hidden">
                          <div className="space-y-2 lg:space-y-3 h-full overflow-y-auto">
                            
                            {/* Event 1: Morning Workout - Compact */}
                            <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg p-2 lg:p-3 text-white shadow-md border-l-4 border-emerald-600">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="bg-white/20 rounded-full p-1 lg:p-1.5">
                                    <Zap className="w-3 h-3 lg:w-4 lg:h-4" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm lg:text-base">9:00 AM</div>
                                    <div className="text-emerald-100 text-xs lg:text-sm">Morning Workout</div>
                                  </div>
                                </div>
                                <span className="text-emerald-100 text-xs lg:text-sm font-medium">60m</span>
                              </div>
                            </div>

                            {/* Event 2: Client Presentation - Taller */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2 lg:p-4 text-white shadow-md border-l-4 border-blue-700">
                              <div className="flex items-start justify-between mb-1 lg:mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="bg-white/20 rounded-full p-1 lg:p-1.5">
                                    <Target className="w-3 h-3 lg:w-5 lg:h-5" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-sm lg:text-lg">10:30 AM</div>
                                    <div className="text-blue-100 text-xs lg:text-base font-medium">Client Presentation</div>
                                    <div className="text-blue-200 text-xs lg:text-sm mt-0.5 lg:mt-1">Big opportunity - high energy needed</div>
                                  </div>
                                </div>
                                <span className="text-blue-100 text-xs lg:text-sm font-medium">90m</span>
                              </div>
                            </div>

                            {/* Mental Health Gap - Prominent Display */}
                            <div className="relative">
                              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-dashed border-green-300 rounded-xl p-2 lg:p-4 my-2 lg:my-3">
                                <div className="text-center">
                                  <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-1 lg:mb-2">
                                    <Heart className="w-3 h-3 lg:w-5 lg:h-5 text-green-600" />
                                    <span className="text-xs lg:text-base font-bold text-green-800">Mental Health Gap</span>
                                    <Heart className="w-3 h-3 lg:w-5 lg:h-5 text-green-600" />
                                  </div>
                                  <div className="text-xs lg:text-sm text-green-700 font-medium">12:00 PM - 2:00 PM</div>
                                  <div className="text-xs lg:text-sm text-green-600 mt-0.5 lg:mt-1">🌿 Unscheduled time preserved for decompression</div>
                                </div>
                                
                                {/* Visual spacer lines */}
                                <div className="flex items-center justify-center space-x-2 mt-2 lg:mt-3">
                                  <div className="h-px bg-green-300 flex-1"></div>
                                  <span className="text-green-500 text-sm lg:text-base">✨</span>
                                  <div className="h-px bg-green-300 flex-1"></div>
                                </div>
                              </div>
                            </div>

                            {/* Event 3: Henry's School Pickup - Medium */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2 lg:p-3 text-white shadow-md border-l-4 border-purple-600">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="bg-white/20 rounded-full p-1 lg:p-1.5">
                                    <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm lg:text-base">2:00 PM</div>
                                    <div className="text-purple-100 text-xs lg:text-sm">Henry's School Pickup</div>
                                    <div className="text-purple-200 text-xs">Family time priority</div>
                                  </div>
                                </div>
                                <span className="text-purple-100 text-xs lg:text-sm font-medium">30m</span>
                              </div>
                            </div>

                            {/* AI Commentary - Enhanced - Moved inside scrollable area */}
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-2 lg:p-3 border border-yellow-200 mt-2 lg:mt-4">
                              <div className="flex items-start space-x-2">
                                <Brain className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs lg:text-base font-semibold text-amber-900">Smart Calendar Building</p>
                                  <p className="text-xs lg:text-sm text-amber-700 mt-0.5 lg:mt-1">✨ Preserving mental health gaps & respecting energy patterns</p>
                                  <div className="flex flex-wrap gap-1 mt-1 lg:mt-2">
                                    <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">🎯 Post-workout focus</span>
                                    <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">🌿 Recovery time</span>
                                    <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">❤️ Family first</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    ) : currentFeature.content.isCalendarAfter ? (
                      /* Calendar After Optimization */
                      <div className="flex flex-col h-full">
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 lg:p-4 border border-green-200 mb-2 lg:mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 text-lg lg:text-xl">✅</span>
                            <div>
                              <p className="text-sm lg:text-base font-medium text-green-900">Calendar Optimized!</p>
                              <p className="text-sm lg:text-base text-green-700">Your schedule is ADHD-brain friendly</p>
                            </div>
                          </div>
                        </div>

                        {/* Optimized Calendar */}
                        <div className="border-b border-gray-200 pb-2 mb-2 lg:mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                            <span className="text-sm lg:text-lg font-medium text-green-600">Tuesday, March 12 - Optimized</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2 lg:space-y-3 overflow-y-auto min-h-0 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-2 lg:p-3">
                          {currentFeature.content.events.map((event, index) => (
                            <div key={index}>
                              <div className="p-2 lg:p-3 rounded-lg bg-blue-500 text-white text-sm lg:text-base shadow-sm">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium text-sm lg:text-lg">{event.time}</div>
                                    <div className="opacity-90 text-xs lg:text-base">{event.title}</div>
                                  </div>
                                  <div className="text-xs lg:text-base opacity-75">{event.duration}min</div>
                                </div>
                              </div>
                              
                              {/* Mental Health Gap */}
                              {currentFeature.content.mentalHealthGap && 
                               currentFeature.content.mentalHealthGap.after === event.time && (
                                <div className="relative">
                                  <div className="h-4 lg:h-6 flex items-center justify-end pr-1 lg:pr-2">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs lg:text-base text-gray-500">mental health gap (nothing scheduled on purpose)!</span>
                                      <span className="text-gray-400 text-sm lg:text-lg">↑</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Smart Calendar Building - Integrated into scrollable area */}
                          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-2 lg:p-3 border border-yellow-200 mt-2 lg:mt-4">
                            <div className="flex items-start space-x-2">
                              <Brain className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs lg:text-base font-semibold text-amber-900">Smart Calendar Building</p>
                                <p className="text-xs lg:text-sm text-amber-700 mt-0.5 lg:mt-1">✨ Preserving mental health gaps & respecting energy patterns</p>
                                <div className="flex flex-wrap gap-1 mt-1 lg:mt-2">
                                  <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">🎯 Post-workout focus</span>
                                  <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">🌿 Recovery time</span>
                                  <span className="text-xs text-amber-600 font-medium bg-amber-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded">❤️ Family first</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Optimizations */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 lg:p-3 border border-blue-200">
                            <p className="text-xs lg:text-base font-medium text-blue-900 mb-1 lg:mb-2">✨ Smart Optimizations:</p>
                            <div className="space-y-1">
                              {currentFeature.content.rescheduledInfo.optimizations.map((optimization, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-blue-600 rounded-full"></span>
                                  <span className="text-xs lg:text-sm text-blue-800">{optimization}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Chat View */
                      <div className="flex flex-col h-full">
                        {/* Time Header - Only show for non-ADHD Brain Trap Support */}
                        {currentFeature.content.time && currentFeature.title !== "ADHD Brain Trap Support" && (
                          <div className="text-center mb-3 lg:mb-4 mt-4 lg:mt-8">
                            <span className="text-sm lg:text-xl text-gray-500 bg-gray-100 px-3 py-2 lg:px-5 lg:py-3 rounded-full font-medium">
                              {currentFeature.content.time}
                            </span>
                          </div>
                        )}

                        {/* Add spacing for ADHD Brain Trap Support to compensate for missing time header */}
                        {currentFeature.title === "ADHD Brain Trap Support" && (
                          <div className="mt-4 lg:mt-8"></div>
                        )}
                        
                        {/* Messages */}
                        <div className="flex-1 space-y-3 lg:space-y-6 overflow-y-auto px-1 lg:px-2 min-h-0">
                          {currentFeature.content.messages && currentFeature.content.messages.map((message, index) => (
                            <div key={index}>
                              {message.type === 'ai' && (
                                <div className="flex items-start space-x-3 lg:space-x-5">
                                  <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 rounded-lg rounded-tl-sm p-3 lg:p-6">
                                      <p className="text-sm lg:text-xl text-gray-800 leading-relaxed">{message.text}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {message.type === 'user' && (
                                <div className="flex justify-end">
                                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg rounded-tr-sm p-3 lg:p-6 max-w-xs lg:max-w-xl">
                                    <p className="text-sm lg:text-xl text-white leading-relaxed">{message.text}</p>
                                  </div>
                                </div>
                              )}
                              
                              {message.type === 'options' && 'choices' in message && message.choices && (
                                <div className="space-y-2 lg:space-y-3">
                                  {message.choices.map((choice: { emoji: string; text: string; desc: string }, choiceIndex: number) => (
                                    <button 
                                      key={choiceIndex}
                                      className="w-full bg-blue-50 hover:bg-blue-100 rounded-lg p-3 lg:p-6 text-left transition-colors border border-blue-200"
                                    >
                                      <div className="text-sm lg:text-xl font-medium text-blue-800 mb-1 lg:mb-2">
                                        {choice.emoji} {choice.text}
                                      </div>
                                      <div className="text-xs lg:text-lg text-blue-600">{choice.desc}</div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Chat Input - Fixed Position */}
                        <div className="border-t border-gray-200 pt-3 lg:pt-4 mt-3 lg:mt-4 flex-shrink-0">
                          <div className="flex items-center space-x-2 lg:space-x-3 bg-gray-50 rounded-full p-2 lg:p-4">
                            <input 
                              type="text" 
                              placeholder="Type your message..." 
                              className="flex-1 bg-transparent text-sm lg:text-base placeholder-gray-500 outline-none px-2 lg:px-3"
                              disabled
                            />
                            <button className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                              <Mic className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </button>
                            <button className="w-8 h-8 lg:w-12 lg:h-12 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors">
                              <Send className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Click to Explore */}
                <div className="text-center">
                  <p className="text-sm lg:text-lg text-gray-500">
                    Click arrows or dots to explore features →
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Journey Visual */}
        <div className="relative">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 lg:mb-4">
              Your BrainSync
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Journey</span>
            </h2>
            <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Follow the path from Sunday overwhelm to ADHD mastery. Every step builds on the last, 
              creating a personalized system that actually works with your brain.
            </p>
          </div>

          {/* Journey Map */}
          <div className="relative bg-white rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-2xl border border-purple-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <defs>
                  <pattern id="journey-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="0.5" fill="currentColor" className="text-purple-600"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#journey-grid)"/>
              </svg>
            </div>

            {/* Journey Path */}
            <svg className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#EC4899" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
              <path
                d="M 50 220 Q 200 160, 350 200 Q 500 240, 650 180 Q 800 140, 950 200 Q 1100 260, 1250 180"
                stroke="url(#pathGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray="20,10"
                opacity="0.6"
              />
            </svg>

            {/* Waypoints */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-4">
              
              {/* Waypoint 1: Sunday Revolution */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-3 lg:mb-4 transform hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 lg:p-4 border border-red-200">
                  <h4 className="font-bold text-red-900 text-xs lg:text-sm mb-1">Sunday Revolution</h4>
                  <p className="text-xs text-red-700">From overwhelming to empowering planning</p>
                </div>
              </div>

              {/* Waypoint 2: AI-Guided Setup */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-3 lg:mb-4 transform hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 lg:p-4 border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-xs lg:text-sm mb-1">AI-Guided Setup</h4>
                  <p className="text-xs text-blue-700">7-phase conversation learns your patterns</p>
                </div>
              </div>

              {/* Waypoint 3: Smart Calendar */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-3 lg:mb-4 transform hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 lg:p-4 border border-purple-200">
                  <h4 className="font-bold text-purple-900 text-xs lg:text-sm mb-1">Smart Calendar</h4>
                  <p className="text-xs text-purple-700">Learns and evolves with your behavior</p>
                </div>
              </div>

              {/* Waypoint 4: Conscious Choices */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-3 lg:mb-4 transform hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 lg:p-4 border border-green-200">
                  <h4 className="font-bold text-green-900 text-xs lg:text-sm mb-1">Conscious Choices</h4>
                  <p className="text-xs text-green-700">Every decision celebrated and honored</p>
                </div>
              </div>

              {/* Waypoint 5: Weekly Support */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-3 lg:mb-4 transform hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-3 lg:p-4 border border-pink-200">
                  <h4 className="font-bold text-pink-900 text-xs lg:text-sm mb-1">Weekly Support</h4>
                  <p className="text-xs text-pink-700">Gentle nudges and choice awareness</p>
                </div>
              </div>

              {/* Waypoint 6: ADHD Mastery */}
              <div className="flex flex-col items-center text-center col-span-2 sm:col-span-1">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white mb-3 lg:mb-4 transform hover:scale-110 transition-transform relative">
                  <Trophy className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                  {/* Success sparkles */}
                  <div className="absolute -top-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 lg:p-4 border border-yellow-200">
                  <h4 className="font-bold text-yellow-900 text-xs lg:text-sm mb-1">ADHD Mastery</h4>
                  <p className="text-xs text-yellow-700">Calendar system that adapts to your brain</p>
                </div>
              </div>

            </div>

            {/* Journey Stats */}
            <div className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 lg:p-6 border border-purple-200">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Week 1</div>
                <p className="text-sm text-purple-700">Sunday planning transformation begins</p>
              </div>
              <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 lg:p-6 border border-blue-200">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Month 1-2</div>
                <p className="text-sm text-blue-700">AI learns your patterns and preferences</p>
              </div>
              <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 lg:p-6 border border-yellow-200">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">Month 3+</div>
                <p className="text-sm text-yellow-700">Personalized ADHD success system emerges</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 lg:mt-12 text-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-xl font-bold text-base lg:text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl flex items-center space-x-3 mx-auto">
                <span>Begin Your Journey</span>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarHeroSection; 