import React from 'react';

const WeeklySupportSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Weekly Support
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Every Monday, you receive a personalized email celebrating last week's wins and 
            setting up this week for ADHD success.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <p className="font-semibold">goodberry</p>
                <p className="text-sm opacity-75">hello@goodberry.ai</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">
                🧠💙 Your Monday Weekly Plan - Week of December 2nd - December 9th
              </p>
            </div>
          </div>

          <div className="p-8 bg-white">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🏆 Last Week's Wins
              </h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-700 mb-3">
                  That client presentation Thursday was <strong>amazing</strong>! You prepared differently this time - 
                  did it right after your morning workout when your brain was sharp. And you didn't schedule 
                  anything right after, so you weren't rushing.
                </p>
                <p className="text-green-700 font-medium">
                  ✨ Post-workout + buffer time = presentation magic. Let's definitely use that pattern for your pitch next week.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                🌅 Your Week at a Glance
              </h3>
              <p className="text-gray-600 mb-4">
                Weather's crisp and clear today (perfect focus energy!), and your calendar 
                shows you've got some exciting wins lined up this week.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">🧠 Deep Work: Business Plan</p>
                    <p className="text-gray-600">Today 9-11 AM (your prime time!)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">📞 Client Strategy Call</p>
                    <p className="text-gray-600">Tuesday 2 PM (prep time built in)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">🏠 Henry Adventure Time</p>
                    <p className="text-gray-600">Wednesday 4-6 PM (protected!)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">🌊 Buffer Zone</p>
                    <p className="text-gray-600">Friday afternoon (flex time)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                💙 Conscious Choice Moments from Last Week
              </h3>
              <p className="text-gray-600 mb-4">
                Your choice-making is getting stronger! Here are moments you practiced conscious decision-making:
              </p>

              <div className="space-y-3">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-xs text-gray-500 mb-2">Wednesday 4:00 PM • Henry time vs. urgent work request</p>
                  <p className="text-sm text-gray-800 italic mb-3">
                    "Your calendar shows 'Henry Time' from 4-6 PM (marked sacred) but there's an urgent client request. 
                    Weather's perfect for that playground trip you planned. What's your call?"
                  </p>
                  <div className="space-y-1 text-xs text-gray-600 mb-2">
                    <p>1️⃣ Honor Henry time (I'll handle the client gracefully)</p>
                    <p>2️⃣ Quick 30-min work then playground</p>
                    <p>3️⃣ Reschedule Henry time (family flexibility)</p>
                  </div>
                  <p className="text-xs text-purple-600 font-medium">
                    ✅ You chose: 1 - That playground laugh was worth everything! Client loved the thoughtful delay.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-500 mb-2">Friday 7:30 PM • Energy check-in</p>
                  <p className="text-sm text-gray-800 italic mb-3">
                    "I notice you've been going strong all week. Your energy feels different tonight - 
                    more contemplative than usual. What does your body need?"
                  </p>
                  <div className="space-y-1 text-xs text-gray-600 mb-2">
                    <p>1️⃣ Creative project time (ride this contemplative wave)</p>
                    <p>2️⃣ Gentle movement (walk, stretch, something flowing)</p>
                    <p>3️⃣ Early wind-down (honor the week you've had)</p>
                  </div>
                  <p className="text-xs text-blue-600 font-medium">
                    ✅ You chose: 2 - That evening walk helped you process the whole week. Beautiful choice.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🎯 This Week's ADHD-Friendly Approach
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✨ Energy Optimization</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Morning workouts before big thinking work</li>
                    <li>• Buffer time after important calls</li>
                    <li>• Wednesday afternoon protected for Henry</li>
                    <li>• Friday flexibility for week processing</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🧠 Brain Support</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Understanding your unique patterns and energy cycles to optimize your schedule.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-3">💙 Your Support System</h4>
              <p className="text-gray-700 mb-3">
                Remember: I'm here throughout the week with gentle choice texts, never overwhelming nudges. 
                Your calendar is designed to work <em>with</em> you, not against you.
              </p>
              <p className="text-gray-700 text-sm">
                Reply to any message if you need support, or ignore them completely - both are perfect choices! 🌟
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklySupportSection; 