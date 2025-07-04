import React, { useState, useEffect } from 'react';

const StreamlinedHero: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Array<{text: string, id: number, type: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState(0);
  
  const conversationSets = [
    // ADHD Tax Escape conversation (first - most compelling)
    [
      { 
        type: 'ai', 
        text: "Hey! I noticed you mentioned feeling stressed about those bills sitting on your counter. The dreaded paper bill pile of doom? 📄💀",
        time: "11:42 AM"
      },
      { 
        type: 'user', 
        text: "Ugh yes. They've been there for 2 weeks. I know I need to deal with them but..."
      },
      { 
        type: 'ai', 
        text: "Classic ADHD tax situation! Your brain sees \"boring admin torture\" and nopes right out. Totally valid response tbh 🧠\n\nWant me to help you escape this particular tax? I've got a sneaky plan..."
      },
      {
        type: 'user',
        text: "Yes please, I'm drowning in late fees"
      },
      {
        type: 'ai',
        text: "Perfect! I see you have a post-workout energy window tomorrow at 10:30 AM. That's your secret weapon time.\n\nHere's the escape plan:\n⏰ Bill Battle: 10:30-11:00 AM (30 min max!)\n🎉 Victory Reward: 11:00-12:00 PM - That hiking trail you love\n\nDeal? We're pairing the drain with the awesome 💙"
      },
      {
        type: 'user',
        text: "Wait, only 30 minutes? But what if I don't finish?"
      },
      {
        type: 'ai',
        text: "Then you don't finish! 🤷‍♀️\n\n30 minutes of bill progress > 2 weeks of bill avoidance. Plus late fees don't care about perfectionism anyway.\n\nYour only job is to show up for 30 minutes. Whatever gets done, gets done. Then IMMEDIATE reward time!"
      },
      {
        type: 'user',
        text: "Okay that actually sounds doable"
      },
      {
        type: 'ai',
        text: "Added to your calendar!\n\nI'll check in with you at 10:25 AM tomorrow with some gentle pre-game motivation. Then celebrate your victory at 11 AM regardless of how much you conquered.\n\nEvery bill you tackle is ADHD tax money back in your pocket! 💪"
      }
    ],
    // Penguin conversation (second)
    [
      { 
        type: 'ai', 
        text: "Hey! I see you have that big presentation tomorrow at 9 AM... 👀",
        time: "10:47 PM"
      },
      { 
        type: 'user', 
        text: "OMG yes, I've been 'preparing' for 3 hours but somehow ended up reading about penguin migration patterns 🐧"
      },
      { 
        type: 'ai', 
        text: "Ha! Classic rabbit hole 😅 You've got 3 choices right now:\n\nWhat feels right for tonight?"
      },
      {
        type: 'choices',
        text: "😴 Honor tomorrow (Get sleep to crush that presentation)\n📱 15 more minutes (With a gentle timer so you don't spiral)\n🐧 Embrace the penguins (But with a 45-min limit!)"
      },
      {
        type: 'user',
        text: '*Taps "📱 15 more minutes" option*\n"Option 2 please! Set that timer 🙏"'
      },
      {
        type: 'ai',
        text: "Timer set! ⏰ And hey - that penguin deep-dive? Pure ADHD gold 💙"
      }
    ],
    // Life goals conversation (third)
    [
      { 
        type: 'ai', 
        text: "Hey! Tell me about what you want to accomplish in your life right now. Don't worry about being organized - just share what comes to mind.",
        time: "2:15 PM"
      },
      { 
        type: 'user', 
        text: "I want to grow my coaching business but also spend quality time with my son Henry. I feel scattered between work and family..."
      },
      { 
        type: 'ai', 
        text: "I hear two important themes: business growth and family connection. Both matter deeply to you. Let's explore what success looks like for both. What would 'quality time with Henry' actually mean to you?"
      },
      {
        type: 'user',
        text: "Like, actual presence. Not just being there while I'm stressed about work. Maybe outdoor adventures, helping with homework without my phone buzzing..."
      },
      {
        type: 'ai',
        text: "That's beautiful - you want to be fully present with Henry, not just physically there. And for your coaching business, what would growth look like that doesn't steal from that family time?"
      },
      {
        type: 'user',
        text: "Maybe 20 clients instead of struggling with 5? But I need boundaries so I'm not working evenings when Henry needs me."
      },
      {
        type: 'ai',
        text: "Perfect! I'm seeing a pattern here - you want professional growth AND family presence. Let me start building some time blocks that honor both... 📅✨"
      }
    ],
    // Sunday planning conversation (fourth) - includes the "ignore" scenario
    [
      { 
        type: 'ai', 
        text: "Hey! It's Sunday evening - perfect time for our weekly planning session. Want to set up this week for success? 📅\n\n1️⃣ Quick 5-min check-in (just the essentials)\n2️⃣ Skip planning but protect tomorrow morning\n3️⃣ Full planning session (we'll make it gentle)",
        time: "6:30 PM"
      },
      { 
        type: 'time_gap', 
        text: "15 minutes later..."
      },
      { 
        type: 'ai', 
        text: "Hey, no pressure! I know Sunday planning can feel overwhelming. 🤗\n\nIf you need me to just create a gentle Monday snapshot from your existing calendar, I can do that instead.\n\nStill: 1, 2, or 3?"
      },
      {
        type: 'ai',
        text: "💙 Or just ignore this too - I'll assume you want to wing it and support you through the week anyway."
      },
      {
        type: 'auto_choice',
        text: "*15 minutes pass with no response*\n\n✨ Choice celebrated! Winging it with gentle support this week."
      }
    ]
  ];

  const demoMessages = conversationSets[activeConversation];

  // Maximum messages to show at once (to preserve phone space)
  const MAX_VISIBLE_MESSAGES = 2;

  // Add a new message with typing animation
  const addMessage = (messageText: string, messageType: string, delay: number = 0, messageIndex: number) => {
    setTimeout(() => {
      setIsTyping(true);
      // Typing delay based on message length (simulate realistic typing)  
      const typingDelay = Math.min(messageText.length * 25 + 800, 2500);
      
      setTimeout(() => {
        setIsTyping(false);
        const newMessage = { text: messageText, id: Date.now() + Math.random(), type: messageType };
        
        setCurrentMessages(prev => {
          const newMessages = [...prev, newMessage];
          
          // When we reach the AI response after choices or certain points, clear previous messages
          // and show this message at the top (like continuing conversation)
          if (messageIndex === 3 || messageIndex === 5 || messageIndex === 6 || 
              (activeConversation === 3 && messageIndex === 2)) {
            return [newMessage]; // Clear previous messages, show only this one
          }
          
          // Otherwise, keep the last MAX_VISIBLE_MESSAGES
          return newMessages.slice(-MAX_VISIBLE_MESSAGES);
        });
        
        // Auto-select choice when we show the choices message
        if (messageIndex === 3 && activeConversation === 1) {
          setTimeout(() => {
            setSelectedChoice("📱 15 more minutes");
          }, 1500);
        }
      }, typingDelay);
    }, delay);
  };

  // Reset and start new conversation
  useEffect(() => {
    setCurrentMessages([]);
    setIsTyping(false);
    setSelectedChoice(null);
    
    // Add messages with consistent 6-second delays
    demoMessages.forEach((message, index) => {
      // Simple consistent timing: each message appears 6 seconds after the previous one
      // First message appears immediately (index 0), then 6 seconds between each subsequent message
      let delay = index * 6000; // 6 seconds between each message consistently
      
      addMessage(message.text, message.type, delay, index);
    });
    
    // Set timer to switch to next conversation following the 6-second rhythm
    // The next message would appear at (lastMessageIndex + 1) * 6000
    // This ensures the final message gets its full 6 seconds of display time
    const nextMessageWouldAppearAt = demoMessages.length * 6000;
    const conversationEndTimer = setTimeout(() => {
      setActiveConversation(prev => (prev + 1) % conversationSets.length);
    }, nextMessageWouldAppearAt);
    
    // Cleanup function to clear timeout if component unmounts or conversation changes
    return () => clearTimeout(conversationEndTimer);
  }, [activeConversation]);

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 shadow-sm animate-fadeIn">
      <div className="text-xs font-medium text-blue-600 mb-2">goodberry</div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  // Get floating elements based on active conversation
  const getFloatingElements = () => {
    if (activeConversation === 0) {
      // ADHD Tax Escape conversation elements (now first)
      return (
        <>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-red-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
            📄
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
            💪
          </div>
        </>
      );
    } else if (activeConversation === 1) {
      // Penguin conversation elements
      return (
        <>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
            🐧
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
            💙
          </div>
        </>
      );
    } else if (activeConversation === 2) {
      // Life goals conversation elements
      return (
        <>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
            👨‍👦
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
            💼
          </div>
        </>
      );
    } else {
      // Sunday planning conversation elements
      return (
        <>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
            📅
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
            ✨
          </div>
        </>
      );
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-adhd-light via-white to-blue-50 px-4 py-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
        {/* Left Content - 60% */}
        <div className="lg:col-span-3 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-lg">
            ✨ The Calendar Revolution for ADHD
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-normal">
              What If Your Calendar Actually{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Understood ADHD?
              </span>
            </h1>
            
            <p className="text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-2xl" style={{ lineHeight: '1.7' }}>
              AI that gets you, and works with you to build <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">calendars that stick</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById('calendar-demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              See How It Works (60 sec)
            </button>
            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Join 1,247 on Waitlist
            </button>
          </div>
        </div>

        {/* Right Visual - 40% */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative">
            {/* Phone Mockup */}
            <div className="w-96 h-[700px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3.5rem] p-8 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Phone Header */}
                <div className="bg-blue-600 p-6 text-center">
                  <h3 className="text-xl font-bold text-white">goodberry</h3>
                  <div className="text-sm text-blue-200 mt-1">
                    {demoMessages[0]?.time || "2:15 PM"}
                  </div>
                </div>
                
                {/* Messages Area */}
                <div className="p-6 space-y-4 h-full bg-gray-50 overflow-y-auto">
                  {currentMessages.map((message) => (
                    <div key={message.id} className="animate-slideInUp">
                      {message.type === 'ai' && (
                        <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                          <div className="text-xs font-medium text-blue-600 mb-2">goodberry</div>
                          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>
                        </div>
                      )}
                      
                      {message.type === 'user' && (
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md p-4 text-white ml-auto max-w-[80%]">
                          <div className="text-xs font-medium text-blue-100 mb-2">You</div>
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                        </div>
                      )}
                      
                      {message.type === 'choices' && (
                        <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200">
                          <div className="text-xs font-medium text-blue-600 mb-2">goodberry</div>
                          <div className="space-y-3">
                            {message.text.split('\n').filter(line => line.trim()).map((choice, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                  (selectedChoice === "📱 15 more minutes" && choice.includes("📱")) ||
                                  (selectedChoice === "2️⃣ Skip planning but protect tomorrow morning" && choice.includes("2️⃣"))
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-300 hover:border-blue-400 bg-white'
                                }`}
                              >
                                <div className="text-sm text-gray-800">
                                  {choice}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {message.type === 'time_gap' && (
                        <div className="text-center my-4">
                          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {message.text}
                          </span>
                        </div>
                      )}
                      
                      {message.type === 'auto_choice' && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded-2xl rounded-bl-md p-4 shadow-sm">
                          <div className="text-xs font-medium text-yellow-700 mb-2">System</div>
                          <p className="text-yellow-800 text-sm leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && <TypingIndicator />}
                </div>
              </div>
            </div>
            
            {/* Dynamic Floating elements */}
            {getFloatingElements()}
          </div>
        </div>
      </div>
      
      {/* Sticky CTA */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start My Calendar →
        </button>
      </div>
    </section>
  );
};

export default StreamlinedHero; 