import React, { useState } from 'react';

const InteractiveDemo = () => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResponse, setShowResponse] = useState(false);

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    setShowResponse(true);
    
    // Reset after a few seconds
    setTimeout(() => {
      setShowResponse(false);
      setSelectedChoice(null);
    }, 4000);
  };

  const choiceResponses = {
    keep_flowing: "🌊 Perfect choice! I'll quietly reschedule your meeting and let you ride this productive wave. Sometimes the best productivity is following your brain's natural rhythm.",
    gentle_transition: "⏰ Great self-awareness! I'll send you a gentle 5-minute warning before your meeting. Taking time to transition consciously is a superpower.",
    compromise: "🤝 Love this balanced approach! Finish your current thought, then we'll ease into meeting mode. You're honoring both your flow and your commitments."
  };

  return (
    <section id="demo" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            Experience the Magic:{' '}
            <span className="text-adhd-blue">Try a Choice Prompt</span>
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            This is what you'd receive when BrainSync Pro detects a transition moment. 
            <span className="adhd-highlight">Choose any option</span> to see our gentle response.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="max-w-4xl mx-auto">
          {/* Demo Phone/SMS Interface */}
          <div className="bg-adhd-dark rounded-3xl p-8 shadow-2xl">
            <div className="bg-white rounded-2xl p-6 mb-6">
              {/* SMS Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-adhd-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🧠</span>
                </div>
                <div>
                  <p className="font-semibold text-adhd-dark">BrainSync Pro</p>
                  <p className="text-sm text-adhd-gray">Your Choice Companion</p>
                </div>
              </div>

              {/* Sample Choice Prompt */}
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-adhd-dark mb-4">
                  <strong>🧠 Brain check!</strong> Your calendar says "team meeting" in 15 minutes, 
                  but I sense you're deep in that coding project. 
                </p>
                <p className="text-adhd-dark mb-4">
                  <strong>Your choices:</strong>
                </p>
              </div>

              {/* Choice Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleChoiceSelect('keep_flowing')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedChoice === 'keep_flowing' 
                      ? 'border-adhd-blue bg-blue-50' 
                      : 'border-gray-300 hover:border-adhd-blue'
                  }`}
                >
                  🌊 <strong>Keep flowing</strong> (I'll handle the meeting)
                </button>
                
                <button
                  onClick={() => handleChoiceSelect('gentle_transition')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedChoice === 'gentle_transition' 
                      ? 'border-adhd-purple bg-purple-50' 
                      : 'border-gray-300 hover:border-adhd-purple'
                  }`}
                >
                  ⏰ <strong>Transition now</strong> (gentle switch mode)
                </button>
                
                <button
                  onClick={() => handleChoiceSelect('compromise')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedChoice === 'compromise' 
                      ? 'border-adhd-green bg-green-50' 
                      : 'border-gray-300 hover:border-adhd-green'
                  }`}
                >
                  🤝 <strong>Compromise</strong> (5 more minutes then switch)
                </button>
              </div>

              {/* Response */}
              {showResponse && selectedChoice && (
                <div className="bg-adhd-blue text-white rounded-lg p-4 animate-fade-in">
                  <p>{choiceResponses[selectedChoice as keyof typeof choiceResponses]}</p>
                </div>
              )}

              {!showResponse && !selectedChoice && (
                <div className="text-center text-adhd-gray italic">
                  ↑ Click any choice to see BrainSync Pro's gentle response
                </div>
              )}
            </div>

            {/* Demo explanation */}
            <div className="text-center">
              <p className="text-adhd-light text-sm">
                💡 <strong>This is just a preview!</strong> Real prompts are personalized based on your 
                calendar, habits, weather, and choice patterns.
              </p>
            </div>
          </div>

          {/* Key differentiators */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-adhd-dark mb-2">Smart Timing</h3>
              <p className="text-adhd-gray">
                Prompts arrive exactly when you need to make a choice, not randomly
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💙</div>
              <h3 className="text-xl font-bold text-adhd-dark mb-2">Zero Judgment</h3>
              <p className="text-adhd-gray">
                Every choice is celebrated as conscious decision-making
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-adhd-dark mb-2">ADHD-Aware</h3>
              <p className="text-adhd-gray">
                Understands flow states, energy cycles, and executive function
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo; 