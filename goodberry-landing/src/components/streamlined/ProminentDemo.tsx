import React, { useState, useEffect } from 'react';

const ProminentDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<Array<{type: string, text: string, id: number}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const demoSteps = [
    {
      title: "Opening Conversation",
      subtitle: "Free-form goal exploration",
      duration: "5-8 minutes",
      borderColor: "from-blue-500 to-indigo-500",
      messages: [
        { type: 'ai', text: "Tell me about what you want to accomplish in your life right now. Don't worry about being organized - just share what comes to mind." },
        { type: 'user', text: "I want to grow my coaching business but also spend quality time with my son Henry. I've been working on this ADHD app and a book, but I feel scattered. I love being outdoors - camping, fishing - but I never seem to make time for it..." },
        { type: 'ai', text: "I hear three important themes: business growth, family connection, and personal renewal through nature. Let's talk about what success looks like for your business in the next year..." }
      ]
    },
    {
      title: "Goal Architecture",
      subtitle: "Breaking down yearly → monthly → weekly",
      duration: "3-5 minutes",
      borderColor: "from-purple-500 to-pink-500",
      messages: [
        { type: 'ai', text: "Let's take that coaching business goal and make it concrete. What would 'growing your business' look like by this time next year?" },
        { type: 'user', text: "I'd love to have 20 regular clients, maybe launch a group program, and actually take weekends off without feeling guilty..." },
        { type: 'ai', text: "Perfect! So 20 clients, a group program, and sustainable boundaries. If we work backwards, that means by March you'd need about 12 clients, which is 2-3 new clients per month. How does that feel as a monthly target?" }
      ]
    },
    {
      title: "ADHD Challenges",
      subtitle: "Understanding your specific struggles",
      duration: "4-6 minutes",
      borderColor: "from-green-500 to-teal-500",
      messages: [
        { type: 'ai', text: "Tell me about the ADHD-specific challenges that make planning and follow-through difficult for you." },
        { type: 'user', text: "I make these elaborate plans on Sunday and then completely ignore them by Tuesday. I get hyperfocused on random things and forget about scheduled calls. Time just... disappears. And don't get me started on the 3am Netflix spirals when I should be sleeping..." },
        { type: 'ai', text: "That's so common! The hyperfocus is actually a superpower - we just need to work with it instead of against it. And those late-night spirals? That's your brain seeking dopamine when it's tired. Let's talk about how to honor those flow states while still protecting important commitments like sleep..." }
      ]
    },
    {
      title: "Energy Patterns",
      subtitle: "When you're at your best/worst",
      duration: "3-4 minutes",
      borderColor: "from-yellow-500 to-orange-500",
      messages: [
        { type: 'ai', text: "When during the day do you feel most sharp and creative? And when do you typically crash?" },
        { type: 'user', text: "Definitely mornings, like 9-11 AM. I can think clearly and get stuff done. After lunch I'm useless until around 4 PM, then I get a second wind around 7 PM." },
        { type: 'ai', text: "Classic energy pattern! So 9-11 AM is your golden window for important work. The afternoon dip is real - that's when we'll schedule easier tasks or breaks. And that 7 PM energy spike? Perfect for creative projects or planning..." }
      ]
    },
    {
      title: "Joy & Balance",
      subtitle: "What energizes vs. drains you",
      duration: "3-5 minutes",
      borderColor: "from-pink-500 to-red-500",
      messages: [
        { type: 'ai', text: "What activities make you feel most alive and energized? And what consistently drains your battery?" },
        { type: 'user', text: "Being outdoors is everything - hiking, camping, fishing with Henry. Long Zoom calls kill me, and admin work makes me want to hide under a blanket." },
        { type: 'ai', text: "Your outdoor time isn't just fun - it's medicine for you! We need to protect that sacred. And those draining activities? We'll batch them, limit them, and always follow them with something energizing..." }
      ]
    },
    {
      title: "Resources & Constraints",
      subtitle: "Your real-world situation",
      duration: "2-4 minutes",
      borderColor: "from-indigo-500 to-purple-500",
      messages: [
        { type: 'ai', text: "Let's get real about your constraints. What are your non-negotiables? What support do you have? What's actually realistic?" },
        { type: 'user', text: "Henry comes first, always. I have some flexibility with my schedule but need to be available for client emergencies. Budget's tight but I can invest in tools that actually work." },
        { type: 'ai', text: "Henry-first is beautiful - that clarity makes everything easier. And emergency availability we can work with - it just means building in buffer time and having backup plans. The constraint breeds creativity..." }
      ]
    },
    {
      title: "Calendar Integration",
      subtitle: "Current calendar patterns",
      duration: "4-6 minutes",
      borderColor: "from-teal-500 to-green-500",
      messages: [
        { type: 'ai', text: "Tell me about your current calendar. What's working? What makes you want to throw your phone across the room?" },
        { type: 'user', text: "I block time for everything but then completely ignore the blocks. Client calls go great but I never plan transition time. I schedule back-to-back meetings and then hate myself." },
        { type: 'ai', text: "Ah, the classic 'perfect plan, terrible execution' cycle! Your instinct to block time is right - we just need to make the blocks work with your brain, not against it. Buffer time isn't optional - it's medicine..." },
        { type: 'calendar', text: "Building your personalized calendar structure..." }
      ]
    }
  ];

  // Maximum messages to show at once (to preserve phone space)
  const MAX_VISIBLE_MESSAGES = 4;

  // Add a new message with typing animation
  const addMessage = (message: {type: string, text: string}, delay: number = 0, messageIndex: number) => {
    setTimeout(() => {
      setIsTyping(true);
      // Typing delay based on message length (simulate realistic typing)
      const typingDelay = Math.min(message.text.length * 30 + 1000, 3000);
      
      setTimeout(() => {
        setIsTyping(false);
        const newMessage = { ...message, id: Date.now() + Math.random() };
        
        setCurrentMessages(prev => {
          const newMessages = [...prev, newMessage];
          
          // Check if this is goodberry's second message (index 2 in most conversations)
          // If so, keep only this message and show it at the top
          if (message.type === 'ai' && messageIndex === 2) {
            return [newMessage]; // Clear previous messages, show only this one
          }
          
          // Otherwise, keep the last MAX_VISIBLE_MESSAGES
          return newMessages.slice(-MAX_VISIBLE_MESSAGES);
        });
      }, typingDelay);
    }, delay);
  };

  // Reset and start new conversation
  useEffect(() => {
    setCurrentMessages([]);
    setMessageIndex(0);
    setIsTyping(false);

    const currentStepMessages = demoSteps[currentStep].messages;
    
    // Add messages with realistic delays
    currentStepMessages.forEach((message, index) => {
      let delay = index * 4000; // 4 seconds between each message
      
      // Add extra 2 seconds after user replies (AI response at index 2)
      if (message.type === 'ai' && index === 2) {
        delay += 2000; // Add 2 extra seconds
      }
      
      addMessage(message, delay, index);
    });
  }, [currentStep]);

  useEffect(() => {
    if (!isPlaying) return;
    
    // Calculate when the last message will appear and add a short delay after that
    const currentStepMessages = demoSteps[currentStep].messages;
    const lastMessageIndex = currentStepMessages.length - 1;
    let lastMessageDelay = lastMessageIndex * 4000; // 4 seconds between each message
    
    // Add extra delay for AI response at index 2 if it exists
    if (currentStepMessages.length > 2 && currentStepMessages[2].type === 'ai') {
      lastMessageDelay += 2000;
    }
    
    // Add typing delay for the last message (estimate based on message length)
    const lastMessage = currentStepMessages[lastMessageIndex];
    const typingDelay = Math.min(lastMessage.text.length * 30 + 1000, 3000);
    
    // Total time = last message appears + typing delay + short pause (3 seconds)
    const totalPhaseTime = lastMessageDelay + typingDelay + 3000;
    
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, totalPhaseTime);
    
    return () => clearTimeout(timer);
  }, [isPlaying, demoSteps.length, currentStep]);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000); // Reduced to 10 seconds since phases are now shorter
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 animate-fadeIn">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-xs">🫐</span>
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 shadow-sm">
          <div className="text-xs font-medium text-blue-600 mb-1">goodberry</div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Watch Your Calendar Get Built
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No forms. No setup. Just conversation.
          </p>
        </div>

        {/* Main Demo Area */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Large Phone Demo */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Phone Mockup - Larger than hero */}
              <div className="w-96 h-[700px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3.5rem] p-8 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Phone Header */}
                  <div className="bg-blue-600 p-6 text-center">
                    <h3 className="text-xl font-bold text-white">goodberry</h3>
                  </div>
                  
                  {/* Messages Area */}
                  <div className="p-6 space-y-4 h-full bg-gray-50 overflow-y-auto">
                    {currentMessages.map((message) => (
                      <div key={message.id} className="animate-slideInUp">
                        {message.type === 'calendar' ? (
                          /* Calendar Building Animation */
                          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                            <div className="text-xs text-gray-500 mb-2">✨ Building Your Calendar...</div>
                            <div className="space-y-2 mb-3">
                              <div className="h-2 bg-blue-200 rounded w-3/4 animate-pulse"></div>
                              <div className="h-2 bg-lime-200 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                              <div className="h-2 bg-purple-200 rounded w-2/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
                            </div>
                            <div className="text-xs text-green-600 font-medium">🎯 Personalized for your unique patterns</div>
                          </div>
                        ) : message.type === 'ai' ? (
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs">🫐</span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                                <div className="text-xs font-medium text-blue-600 mb-2">goodberry</div>
                                <p className="text-gray-800 text-sm leading-relaxed">{message.text}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="flex-1">
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md p-4 text-white shadow-sm">
                                <div className="text-xs font-medium text-blue-100 mb-2">You</div>
                                <p className="text-sm leading-relaxed">{message.text}</p>
                              </div>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">D</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && <TypingIndicator />}
                  </div>
                </div>
              </div>
              
              {/* Floating Animation Elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🧠
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                ✨
              </div>
              <div className="absolute top-1/2 -left-8 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl animate-ping">
                💬
              </div>
            </div>
          </div>

          {/* Side Content */}
          <div className="flex-1 space-y-8">
            {/* Step Indicators */}
            <div className="space-y-3">
              {demoSteps.map((step, index) => {
                // Define specific border colors for each phase when active
                const getActiveBorderColor = (stepIndex: number) => {
                  switch(stepIndex) {
                    case 0: return 'border-blue-500'; // Opening Conversation
                    case 1: return 'border-purple-500'; // Goal Architecture
                    case 2: return 'border-green-500'; // ADHD Challenges
                    case 3: return 'border-yellow-500'; // Energy Patterns
                    case 4: return 'border-pink-500'; // Joy & Balance
                    case 5: return 'border-indigo-500'; // Resources & Constraints
                    case 6: return 'border-teal-500'; // Calendar Integration
                    default: return 'border-blue-500';
                  }
                };

                const getActiveBgColor = (stepIndex: number) => {
                  switch(stepIndex) {
                    case 0: return 'bg-blue-50'; // Opening Conversation
                    case 1: return 'bg-purple-50'; // Goal Architecture
                    case 2: return 'bg-green-50'; // ADHD Challenges
                    case 3: return 'bg-yellow-50'; // Energy Patterns
                    case 4: return 'bg-pink-50'; // Joy & Balance
                    case 5: return 'bg-indigo-50'; // Resources & Constraints
                    case 6: return 'bg-teal-50'; // Calendar Integration
                    default: return 'bg-blue-50';
                  }
                };

                const getActiveNumberColor = (stepIndex: number) => {
                  switch(stepIndex) {
                    case 0: return 'bg-blue-500'; // Opening Conversation
                    case 1: return 'bg-purple-500'; // Goal Architecture
                    case 2: return 'bg-green-500'; // ADHD Challenges
                    case 3: return 'bg-yellow-500'; // Energy Patterns
                    case 4: return 'bg-pink-500'; // Joy & Balance
                    case 5: return 'bg-indigo-500'; // Resources & Constraints
                    case 6: return 'bg-teal-500'; // Calendar Integration
                    default: return 'bg-blue-500';
                  }
                };

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      currentStep === index
                        ? `${getActiveBorderColor(index)} ${getActiveBgColor(index)} shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-25'
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        currentStep === index
                          ? `${getActiveNumberColor(index)} text-white shadow-md`
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm ${
                          currentStep === index ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-xs mt-1 ${
                          currentStep === index ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {step.subtitle}
                        </p>
                        <p className={`text-xs mt-1 ${
                          currentStep === index ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features Highlighted */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-gray-700">Builds calendar as you chat</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧠</span>
                  <span className="text-gray-700">Understands ADHD patterns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <span className="text-gray-700">Works through text messages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-700">Gets smarter over time</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Start My Calendar Conversation
            </button>
          </div>
        </div>

        {/* Play/Pause Control */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
          >
            <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
            <span className="font-medium text-gray-700">
              {isPlaying ? 'Pause Demo' : 'Play Demo'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProminentDemo; 