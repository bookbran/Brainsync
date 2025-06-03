import React from 'react';

const EmailPreview = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            See your daily{' '}
            <span className="text-adhd-blue">gentle guidance</span>{' '}
            in action
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            This is what lands in your inbox every morning - no pressure, just understanding 
            and choice celebration.
          </p>
        </div>

        {/* Email mockup */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Email header */}
            <div className="bg-adhd-blue text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div>
                  <p className="font-semibold">BrainSync Pro</p>
                  <p className="text-sm opacity-75">brainsync@aportlandcareer.com</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold">
                  🧠💙 Your Gentle Daily Guide - Tuesday, June 2nd
                </p>
              </div>
            </div>

            {/* Email content */}
            <div className="p-8">
              <p className="text-lg text-adhd-dark mb-6">
                Hi Daniel! 👋
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-adhd-dark mb-3">
                    🌅 Morning Energy Check
                  </h3>
                  <p className="text-adhd-gray">
                    Your brain is online and thinking about the day ahead - that's already a win! 
                    I see you've got that "deep work block" planned for 10 AM, and the weather's 
                    looking sunny (great for focus energy).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-adhd-dark mb-3">
                    🎯 Gentle Opportunities
                  </h3>
                  <p className="text-adhd-gray mb-3">
                    Some options for today (if you're feeling it):
                  </p>
                  <ul className="text-adhd-gray space-y-2 ml-4">
                    <li>• That coding project is calling your name - maybe honor that flow state?</li>
                    <li>• Your Habitica streak is looking strong - you're on a 5-day roll! 🔥</li>
                    <li>• Weather says 72°F and sunny - perfect for that outdoor brainstorming session</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-adhd-dark mb-3">
                    💖 Choice Celebration
                  </h3>
                  <p className="text-adhd-gray">
                    Yesterday you actively chose to take a break when you felt overwhelmed - 
                    that's incredible self-awareness! You also chose to reorganize your workspace 
                    instead of forcing that presentation, and honestly? That counts as productive 
                    too. <span className="adhd-highlight">Your brain knew what it needed.</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-adhd-dark mb-3">
                    🎉 This Week So Far
                  </h3>
                  <div className="bg-adhd-light p-4 rounded-lg">
                    <ul className="text-adhd-dark space-y-1 text-sm">
                      <li>• 12 conscious choices made (that's self-awareness!)</li>
                      <li>• 4 times you chose rest over pushing through</li>
                      <li>• 3 flow states you honored instead of interrupting</li>
                      <li>• 2 meetings you rescheduled to match your energy</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-adhd-gray text-sm">
                    💌 <strong>How did this land with you?</strong> Reply with:
                  </p>
                  <div className="flex space-x-4 mt-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      🎯 "Helpful"
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      🤗 "Gentle"
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      🔄 "Different"
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email footer */}
            <div className="bg-gray-50 p-6 text-center">
              <p className="text-sm text-adhd-gray">
                BrainSync Pro - Celebrating your choices, honoring your brain
              </p>
              <p className="text-xs text-adhd-gray mt-2">
                Choice is power | Built with 💙 for ADHD brains
              </p>
            </div>
          </div>

          {/* Key benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-bold text-adhd-dark mb-2">Daily, Not Overwhelming</h4>
              <p className="text-adhd-gray text-sm">
                One gentle email per day, perfectly timed for your morning routine
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-adhd-dark mb-2">Personalized Content</h4>
              <p className="text-adhd-gray text-sm">
                Based on YOUR calendar, habits, weather, and choice patterns
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💙</div>
              <h4 className="font-bold text-adhd-dark mb-2">Always Understanding</h4>
              <p className="text-adhd-gray text-sm">
                Zero guilt, maximum celebration of your conscious decision-making
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailPreview; 