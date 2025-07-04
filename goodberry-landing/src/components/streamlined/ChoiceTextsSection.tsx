import React, { useState, useEffect } from 'react';

const ChoiceTextsSection: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<Array<{text: string, id: number}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const choiceJourney = [
    {
      time: '10:30 PM',
      title: 'First Nudge',
      subtitle: 'Conscious choice check-in',
      messages: [
        "Hey! I notice it's 10:30 PM and you mentioned those late-night Netflix spirals in our chat. You have that important client presentation tomorrow at 10:30 AM.",
        "Right now you get to make a conscious choice: 🌙",
        "1️⃣ Honor tomorrow (Get sleep to crush that presentation)\n2️⃣ 15 more minutes (With a gentle timer so you don't spiral)\n3️⃣ Something gentler (Journal, soft music, or gentle movement)",
        "Whatever you choose, I celebrate it. No judgment here! 💙"
      ]
    },
    {
      time: '11:45 PM',
      title: 'Follow-up',
      subtitle: 'Gentle check without judgment',
      messages: [
        "Hey, I see you're still up! 👀",
        "Plot twist: I'm not going to sleep right now either. The late-night brain wants what it wants! 🧠✨",
        "No judgment here - just checking: are you choosing this Netflix time, or did your brain just kinda... drift here? 🤔",
        "1️⃣ I'm choosing this (Own your choice!)\n2️⃣ I drifted but staying up (That's honest!)\n3️⃣ I want to shift toward sleep (Let's do it gently)"
      ]
    },
    {
      time: '7:30 AM',
      title: 'Celebration',
      subtitle: 'Morning choice recognition',
      messages: [
        "Good morning! ☀️ I hope you got some rest.",
        "No matter what happened last night - whether you slept early, stayed up by choice, or got caught in a spiral - you made it through. That's what matters.",
        "Ready to make this presentation amazing? Your 9-11 AM energy window is perfect timing! 🚀",
        "And hey - tonight we can try those evening choices again. Every day is a new chance to practice conscious decisions. 💙"
      ]
    }
  ];

  // Maximum messages to show at once (to preserve phone space)
  const MAX_VISIBLE_MESSAGES = 3;

  // Add a new message with typing animation
  const addMessage = (messageText: string, delay: number = 0, messageIndex: number) => {
    setTimeout(() => {
      setIsTyping(true);
      // Typing delay based on message length (simulate realistic typing)
      const typingDelay = Math.min(messageText.length * 25 + 800, 2500);
      
      setTimeout(() => {
        setIsTyping(false);
        const newMessage = { text: messageText, id: Date.now() + Math.random() };
        
        setCurrentMessages(prev => {
          const newMessages = [...prev, newMessage];
          
          // When goodberry speaks for the second time (index 1), clear previous messages
          // and show this message at the top
          if (messageIndex === 1) {
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

    const currentPhaseMessages = choiceJourney[activePhase].messages;
    
    // Add messages with realistic delays
    currentPhaseMessages.forEach((message, index) => {
      const delay = index * 3500; // 3.5 seconds between each message
      addMessage(message, delay, index);
    });
  }, [activePhase]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % choiceJourney.length);
    }, 27000); // Increased from 18000 to 27000 (1.5x extension) to allow more time for each choice journey phase
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePhaseClick = (phaseIndex: number) => {
    setActivePhase(phaseIndex);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 20000); // Increased from 15000 to 20000 to match the longer timing
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4 shadow-sm animate-fadeIn">
      <div className="text-xs font-medium text-purple-600 mb-2">goodberry</div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  return (
    <section id="choice-texts" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Choice Texts</span> Save You From Brain Traps
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Follow the timeline through a real evening... From 3AM Netflix spirals to conscious sleep choices.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 inline-flex space-x-1">
            {choiceJourney.map((phase, index) => (
              <button
                key={index}
                onClick={() => handlePhaseClick(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activePhase === index
                    ? 'bg-white text-indigo-900 shadow-lg'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="font-bold">{phase.time}</div>
                <div className="text-xs opacity-75">{phase.title}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-96 h-[700px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3.5rem] p-8 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="bg-blue-600 p-6 text-center">
                    <h3 className="text-xl font-bold text-white">goodberry</h3>
                  </div>
                  
                  <div className="p-6 space-y-4 h-full bg-gray-50 overflow-y-auto">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-200 animate-slideInUp"
                      >
                        <div className="text-xs font-medium text-purple-600 mb-2">goodberry</div>
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                          {message.text}
                        </p>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && <TypingIndicator />}
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🧠
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                💙
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                {choiceJourney[activePhase].title} - {choiceJourney[activePhase].time}
              </h3>
              <p className="text-indigo-200 text-lg mb-6">
                {choiceJourney[activePhase].subtitle}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-white">Always 3 choices - never binary pressure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💙</span>
                  <span className="text-white">No judgment zone - celebrate every decision</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧠</span>
                  <span className="text-white">Your patterns honored and understood</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <span className="text-white">Conscious choice-making over shame spirals</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">
                The Magic of Choice Awareness
              </h4>
              <div className="space-y-4 text-indigo-200">
                <p>
                  <strong className="text-white">Before goodberry:</strong> Endless guilt spirals about "should have gone to bed earlier"
                </p>
                <p>
                  <strong className="text-white">With goodberry:</strong> "I chose to stay up and own that choice" or "I want to shift toward sleep"
                </p>
                <p>
                  <strong className="text-white">The difference:</strong> Agency transforms shame into self-awareness 💫
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
              >
                <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
                <span className="font-medium text-white">
                  {isPlaying ? 'Pause Journey' : 'Play Journey'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChoiceTextsSection; 