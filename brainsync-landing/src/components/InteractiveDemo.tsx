import React, { useState } from 'react';

const InteractiveDemo = () => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showNudgeDemo, setShowNudgeDemo] = useState(false);

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    setShowResponse(true);
    
    // Reset after a few seconds
    setTimeout(() => {
      setShowResponse(false);
      setSelectedChoice(null);
    }, 5000);
  };

  const choiceResponses = {
    '1': "🌊 Perfect choice! I'll quietly reschedule your meeting and let you ride this productive wave. Sometimes the best productivity is following your brain's natural rhythm.",
    '2': "⏰ Great self-awareness! I'll send you a gentle 5-minute warning before your meeting. Taking time to transition consciously is a superpower.",
    '3': "🤝 Love this balanced approach! Finish your current thought, then we'll ease into meeting mode. You're honoring both your flow and your commitments."
  };

  return (
    <section id="demo" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            Experience the Magic:{' '}
            <span className="text-adhd-blue">Try a Choice Text</span>
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            This is what you'd actually receive as a text message. No apps to download - just reply with a number.
            <span className="adhd-highlight">Try typing 1, 2, or 3</span> to see our gentle response.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* First Phone - Main Choice Demo */}
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-adhd-dark mb-4 text-center">📱 Choice Moment</h3>
            
            {/* iPhone Frame */}
            <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-white rounded-[2.2rem] h-[600px] flex flex-col overflow-hidden">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-2 text-black text-sm font-semibold">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                  </div>
                </div>
                
                {/* Messages Header */}
                <div className="flex items-center px-4 py-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">🧠</span>
                  </div>
                  <div>
                    <p className="font-semibold text-black">BrainSync Pro</p>
                    <p className="text-xs text-gray-500">Your Choice Companion</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
                  {/* Incoming message */}
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                      <p className="text-black text-sm">
                        🧠 <strong>Brain check!</strong> Your calendar says "team meeting" in 15 minutes, but I sense you're deep in that coding project.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                      <p className="text-black text-sm">
                        <strong>Your choices:</strong><br/>
                        1️⃣ Keep flowing (I'll reschedule the meeting for you)<br/>
                        2️⃣ Transition now (gentle switch mode)<br/>
                        3️⃣ Compromise (5 more minutes then switch)
                      </p>
                    </div>
                  </div>

                  {/* User response simulation */}
                  {selectedChoice && (
                    <div className="flex justify-end">
                      <div className="bg-blue-500 rounded-2xl rounded-br-md px-4 py-2">
                        <p className="text-white text-sm font-medium">{selectedChoice}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Response */}
                  {showResponse && selectedChoice && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs animate-fade-in">
                        <p className="text-black text-sm">
                          {choiceResponses[selectedChoice as keyof typeof choiceResponses]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Keyboard simulation */}
                <div className="bg-gray-100 px-4 py-3 rounded-b-[2rem]">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['1', '2', '3'].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleChoiceSelect(num)}
                        className={`bg-white rounded-lg py-3 text-black font-semibold text-lg shadow-sm hover:bg-gray-50 transition-all ${
                          selectedChoice === num ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {!selectedChoice ? 'Tap a number to reply' : 'Message sent!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Phone - Nudge Demo */}
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-adhd-dark mb-4 text-center">📱 When You Ignore It</h3>
            <p className="text-sm text-adhd-gray text-center mb-4">
              😅 Because we know you will... you have ADHD!
            </p>
            
            {/* iPhone Frame */}
            <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-white rounded-[2.2rem] h-[600px] flex flex-col overflow-hidden">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-2 text-black text-sm font-semibold">
                  <span>9:46</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                  </div>
                </div>
                
                {/* Messages Header */}
                <div className="flex items-center px-4 py-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">🧠</span>
                  </div>
                  <div>
                    <p className="font-semibold text-black">BrainSync Pro</p>
                    <p className="text-xs text-gray-500">Your Choice Companion</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
                  {/* Original message */}
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs opacity-60">
                      <p className="text-black text-xs">
                        🧠 Brain check! Meeting in 15 min but you're in flow. Reply 1, 2, or 3 for your choice.
                      </p>
                    </div>
                  </div>

                  {/* Time gap indicator */}
                  <div className="text-center">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      5 minutes later...
                    </span>
                  </div>

                  {/* Gentle nudge */}
                  <div className="flex justify-start">
                    <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                      <p className="text-black text-sm">
                        Hey, I don't want to bother you like this, but what's your choice? 🤗 
                        
                        I know you saw my text (ADHD brain, right?). No judgment - just reply when you can. 
                        
                        Still: 1, 2, or 3?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                      <p className="text-black text-xs">
                        💙 Or ignore this too - I'll assume you chose to keep flowing and handle it accordingly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-100 px-4 py-3 rounded-b-[2rem]">
                  <button
                    onClick={() => setShowNudgeDemo(!showNudgeDemo)}
                    className="w-full bg-yellow-400 rounded-lg py-2 text-black font-medium text-sm hover:bg-yellow-300 transition-all"
                  >
                    {showNudgeDemo ? 'Perfect! 🎯' : 'See the gentle nudge →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key differentiators */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-adhd-dark mb-2">Real Text Messages</h3>
            <p className="text-adhd-gray">
              No app downloads - works with any phone. Just reply with numbers.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤗</div>
            <h3 className="text-xl font-bold text-adhd-dark mb-2">ADHD-Aware Nudging</h3>
            <p className="text-adhd-gray">
              Gentle follow-ups that understand procrastination without judgment
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💙</div>
            <h3 className="text-xl font-bold text-adhd-dark mb-2">Smart Assumptions</h3>
            <p className="text-adhd-gray">
              If you don't reply, we assume the choice that honors your current state
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo; 