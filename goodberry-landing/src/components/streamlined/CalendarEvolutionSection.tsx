import React, { useState, useEffect } from 'react';

const CalendarEvolutionSection: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<Array<{type: string, text: string, id: number}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const evolutionMonths = [
    {
      month: 1,
      title: "Basic Structure",
      description: "Learning your basic patterns and protecting non-negotiables like Henry time.",
      conversation: [
        { type: 'ai', text: "Great! I've started with your core essentials. As I learn your patterns, I'll suggest energy-aligned additions. How does this basic structure feel?" },
        { type: 'user', text: "This feels manageable! I love that you protected the fishing time with Henry. Can we add more as I get comfortable?" },
        { type: 'ai', text: "Exactly! We'll build slowly as you gain confidence. Next month I'll start suggesting energy optimizations based on what I observe. ✨" }
      ]
    },
    {
      month: 2,
      title: "Energy Optimization",
      description: "Recognizing your energy patterns and adding supporting activities.",
      conversation: [
        { type: 'ai', text: "I notice you're most productive after workouts! I've added buffer time after your big presentation. Should we experiment with more morning energy blocks?" },
        { type: 'user', text: "Yes! The workout timing is perfect, and that buffer after presentations is genius. I'm not rushing anymore." },
        { type: 'ai', text: "That's the ADHD-friendly approach working! Next month we'll add mindfulness elements and perfect those transitions. 🧠" }
      ]
    },
    {
      month: 3,
      title: "Full ADHD Flow",
      description: "Calendar works seamlessly with your unique rhythms.",
      conversation: [
        { type: 'ai', text: "Look how far you've come! Your calendar now flows with your natural rhythms. Want to fine-tune anything for next week?" },
        { type: 'user', text: "This is incredible! I actually follow my schedule now because it works WITH my brain instead of against it." },
        { type: 'ai', text: "That's the goal! Your calendar is now a tool that celebrates your neurodivergent superpowers instead of fighting them. Welcome to ADHD calendar mastery! 🎉" }
      ]
    }
  ];

  // Maximum messages to show at once (to preserve phone space)
  const MAX_VISIBLE_MESSAGES = 3;

  // Add a new message with typing animation
  const addMessage = (message: {type: string, text: string}, delay: number = 0, messageIndex: number) => {
    setTimeout(() => {
      setIsTyping(true);
      // Typing delay based on message length (simulate realistic typing)
      const typingDelay = Math.min(message.text.length * 25 + 800, 2500);
      
      setTimeout(() => {
        setIsTyping(false);
        const newMessage = { ...message, id: Date.now() + Math.random() };
        
        setCurrentMessages(prev => {
          const newMessages = [...prev, newMessage];
          
          // Check if this is goodberry's second message (index 2 in conversations)
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
    setIsTyping(false);

    const currentMonthConversation = evolutionMonths[activeMonth].conversation;
    
    // Add messages with realistic delays
    currentMonthConversation.forEach((message, index) => {
      let delay = index * 3000; // 3 seconds between each message
      
      // Add extra 2 seconds after user replies (AI response at index 2)
      if (message.type === 'ai' && index === 2) {
        delay += 2000; // Add 2 extra seconds
      }
      
      addMessage(message, delay, index);
    });
  }, [activeMonth]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setActiveMonth((prev) => (prev + 1) % evolutionMonths.length);
    }, 15000); // Increased from 12000 to 15000 (15 seconds) to allow full conversations to play
    
    return () => clearInterval(timer);
  }, [isPlaying]);

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
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">goodberry</span> Gets Even Better Over Time
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch your calendar transform as the AI learns your patterns and perfects your ADHD support system.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-blue-200 inline-flex space-x-2">
            {evolutionMonths.map((month, index) => (
              <button
                key={index}
                onClick={() => setActiveMonth(index)}
                className={`px-6 py-4 rounded-lg transition-all duration-300 ${
                  activeMonth === index
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <div className="font-bold">Month {month.month}</div>
                <div className="text-xs opacity-75">{month.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Phone Demo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-96 h-[700px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3.5rem] p-8 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Phone Header */}
                  <div className="bg-blue-600 p-6 text-center">
                    <h3 className="text-xl font-bold text-white">goodberry</h3>
                  </div>
                  
                  {/* Messages Area */}
                  <div className="relative p-6 space-y-4 h-full bg-gray-50 overflow-y-auto">
                    {currentMessages.map((message) => (
                      <div key={message.id} className="animate-slideInUp">
                        {message.type === 'ai' ? (
                          <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                            <div className="text-xs font-medium text-blue-600 mb-2">goodberry</div>
                            <p className="text-gray-800 text-sm leading-relaxed">
                              {message.text}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md p-4 text-white ml-auto max-w-[80%]">
                            <div className="text-xs font-medium text-blue-100 mb-2">You</div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && <TypingIndicator />}

                    {/* Bottom Right Emoji */}
                    <div className="absolute bottom-6 right-6 text-3xl animate-pulse">
                      ✨
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🧠
              </div>
              <div className="absolute bottom-32 -right-6 w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                ✨
              </div>
            </div>
          </div>

          {/* Calendar Evolution Info */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Month {evolutionMonths[activeMonth].month}: {evolutionMonths[activeMonth].title}
            </h3>
            <p className="text-gray-600 mb-6">{evolutionMonths[activeMonth].description}</p>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-[24px_1fr_1fr] gap-4">
                {/* Time Column */}
                <div className="w-4"></div>

                {/* Sunday Column */}
                <div className="relative min-h-[600px]">
                  <div className="absolute top-0 left-0 right-4">
                    <div className="text-xs font-medium text-gray-800">Sunday</div>
                  </div>

                  {/* Base Month 1 - Blue */}
                  <div className="absolute top-[160px] h-[128px] left-0 right-4">
                    <div className="bg-[rgb(59,130,246)] text-white rounded-lg p-2 shadow-md h-full">
                      <div className="flex justify-between items-start">
                        <span className="text-xs">🎣 Fishing with Henry</span>
                        <span className="text-[10px] opacity-75">240min</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Month 3 Only */}
                  {activeMonth >= 2 && (
                    <>
                      <div className="absolute top-[376px] h-[32px] left-0 right-4">
                        <div className="bg-[rgb(168,85,247)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">✨ goodberry planning</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-[456px] h-[32px] left-0 right-4">
                        <div className="bg-[rgb(168,85,247)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">🌙 Gentle Evening Flow</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Monday Column */}
                <div className="relative min-h-[600px]">
                  <div className="absolute top-0 left-0 right-4">
                    <div className="text-xs font-medium text-gray-800">Monday</div>
                  </div>
                  
                  {/* Base Month 1 - Blue */}
                  <div className="absolute top-[144px] h-[64px] left-0 right-4">
                    <div className="bg-[rgb(59,130,246)] text-white rounded-lg p-2 shadow-md h-full">
                      <div className="flex justify-between items-start">
                        <span className="text-xs">Deep Work</span>
                        <span className="text-[10px] opacity-75">120min</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[336px] h-[48px] left-0 right-4">
                    <div className="bg-[rgb(59,130,246)] text-white rounded-lg p-2 shadow-md h-full">
                      <div className="flex justify-between items-start">
                        <span className="text-xs">Client Meeting</span>
                        <span className="text-[10px] opacity-75">60min</span>
                      </div>
                    </div>
                  </div>

                  {/* Month 2 Additions - Lime */}
                  {activeMonth >= 1 && (
                    <>
                      <div className="absolute top-[48px] h-[48px] left-0 right-4">
                        <div className="bg-[rgb(132,204,22)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-start">
                            <span className="text-xs">🏋️‍♂️ Energy Boost Workout</span>
                            <span className="text-[10px] opacity-75">60min</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-[208px] h-[56px] left-0 right-4">
                        <div className="bg-[rgb(132,204,22)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-start">
                            <span className="text-xs">⚡ Transition Buffer</span>
                            <span className="text-[10px] opacity-75">90min</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Month 3 Additions - Purple */}
                  {activeMonth >= 2 && (
                    <>
                      <div className="absolute top-[400px] h-[32px] left-0 right-4">
                        <div className="bg-[rgb(168,85,247)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">👥 Social Planning</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-[456px] h-[32px] left-0 right-4">
                        <div className="bg-[rgb(168,85,247)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">🌙 Gentle Evening Flow</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-[496px] h-[32px] left-0 right-4">
                        <div className="bg-[rgb(168,85,247)] text-white rounded-lg p-2 shadow-md h-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs">📚 Reading Ritual</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 italic">
                  {activeMonth === 0 && "Month 1: Basic structure with team meetings"}
                  {activeMonth === 1 && "Month 2: Added energy-optimized workouts and focus blocks"}
                  {activeMonth === 2 && "Month 3: Enhanced with mindful planning and quality time"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <div className="flex gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
              <span className="font-medium">
                {isPlaying ? 'Pause Evolution' : 'Play Evolution'}
              </span>
            </button>
            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>🚀</span>
              Join the Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarEvolutionSection; 