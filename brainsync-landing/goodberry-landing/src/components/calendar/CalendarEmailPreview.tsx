import React, { useState } from 'react';

const CalendarEmailPreview = () => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [activeTab, setActiveTab] = useState<'nudges' | 'planning' | 'followthrough'>('nudges');

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
    '1': "🌅 Perfect! Sunday planning session scheduled for 7:00 PM. I'll make sure Henry's dinner is sorted and your favorite planning tea is ready. Let's make this week amazing!",
    '2': "⏰ Smart choice! I'll reschedule to 8:30 PM and set up a cozy 15-minute session. Sometimes the best planning happens when you're truly ready.",
    '3': "🌊 Totally understand! I'll move it to next weekend and instead send you a gentle Monday morning plan based on what's already in your calendar. No pressure, just support."
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            Planning + Following Through:{' '}
            <span className="text-adhd-blue">See the Magic</span>
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            From Sunday planning to Friday celebrations - this is what conscious calendar management 
            looks like when you have ADHD support that actually gets it.
          </p>
        </div>

        {/* Animated Arrow Call-to-Action */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <p className="text-lg font-semibold text-adhd-dark mb-2">
              👇 Click these tabs to see your ADHD-friendly support in action!
            </p>
            <div className="animate-bounce">
              <svg 
                className="w-8 h-8 text-adhd-blue" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 flex space-x-2 shadow-lg">
            <button 
              onClick={() => setActiveTab('nudges')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'nudges' 
                  ? 'bg-adhd-blue text-white shadow-lg' 
                  : 'text-adhd-gray hover:text-adhd-dark'
              }`}
            >
              📱 Choice Texts
            </button>
            <button 
              onClick={() => setActiveTab('planning')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'planning' 
                  ? 'bg-adhd-blue text-white shadow-lg' 
                  : 'text-adhd-gray hover:text-adhd-dark'
              }`}
            >
              📅 Sunday Planning
            </button>
            <button 
              onClick={() => setActiveTab('followthrough')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'followthrough' 
                  ? 'bg-adhd-blue text-white shadow-lg' 
                  : 'text-adhd-gray hover:text-adhd-dark'
              }`}
            >
              📧 Weekly Support
            </button>
          </div>
        </div>

        {/* Interactive Phone Demo */}
        {activeTab === 'nudges' && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              {/* First Phone - Sunday Planning Choice */}
              <div className="max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-adhd-dark mb-4 text-center">📱 Sunday Planning Check-in</h3>
                
                {/* iPhone Frame */}
                <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-white rounded-[2.2rem] h-[600px] flex flex-col overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-2 text-black text-sm font-semibold">
                      <span>6:45</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Messages Header */}
                    <div className="flex items-center px-4 py-3 border-b border-gray-200">
                      <div className="w-8 h-8 bg-adhd-blue rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">🧠</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">goodberry</p>
                        <p className="text-xs text-gray-500">Your Calendar Companion</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
                      {/* Incoming message */}
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                          <p className="text-black text-sm">
                            🌅 <strong>Sunday vibes check!</strong> Ready for our weekly planning session? I can see you've got some exciting things coming up this week.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                          <p className="text-black text-sm">
                            <strong>Your choices:</strong><br/>
                            1️⃣ Yes! Let's plan (I'm ready to rock this week)<br/>
                            2️⃣ In an hour? (Need some transition time)<br/>
                            3️⃣ Skip this week (Just wing it Monday)
                          </p>
                        </div>
                      </div>

                      {/* User response simulation */}
                      {selectedChoice && (
                        <div className="flex justify-end">
                          <div className="bg-adhd-blue rounded-2xl rounded-br-md px-4 py-2">
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
                              selectedChoice === num ? 'bg-blue-100 ring-2 ring-adhd-blue' : ''
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {!selectedChoice ? 'Tap a number to reply' : 'Choice sent!'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Phone - Gentle Nudging */}
              <div className="max-w-sm mx-auto">
                <h3 className="text-xl font-bold text-adhd-dark mb-4 text-center">📱 When You Ignore It</h3>
                <p className="text-sm text-adhd-gray text-center mb-4">
                  😅 Because Sunday planning anxiety is real!
                </p>
                
                {/* iPhone Frame */}
                <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="bg-white rounded-[2.2rem] h-[600px] flex flex-col overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-2 text-black text-sm font-semibold">
                      <span>7:15</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Messages Header */}
                    <div className="flex items-center px-4 py-3 border-b border-gray-200">
                      <div className="w-8 h-8 bg-adhd-blue rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">🧠</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">goodberry</p>
                        <p className="text-xs text-gray-500">Your Calendar Companion</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
                      {/* Original message */}
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs opacity-60">
                          <p className="text-black text-xs">
                            🌅 Ready for planning? Reply 1, 2, or 3 for your choice.
                          </p>
                        </div>
                      </div>

                      {/* Time gap indicator */}
                      <div className="text-center">
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          30 minutes later...
                        </span>
                      </div>

                      {/* Gentle nudge */}
                      <div className="flex justify-start">
                        <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
                          <p className="text-black text-sm">
                            Hey, no pressure! I know Sunday planning can feel overwhelming. 🤗 
                            
                            If you need me to just create a gentle Monday snapshot from your existing calendar, I can do that instead.
                            
                            Still: 1, 2, or 3?
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                          <p className="text-black text-xs">
                            💙 Or just ignore this - I'll assume you want to wing it and support you through the week anyway.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-100 px-4 py-3 rounded-b-[2rem]">
                      <div className="w-full bg-yellow-400 rounded-lg py-2 text-black font-medium text-sm text-center">
                        Choice celebrated either way! 🎯
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Choice Examples */}
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
              <h3 className="text-2xl font-bold text-adhd-dark mb-6 text-center">📱 Your Real Calendar Choice Moments</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-500 mb-2">Monday 10:15 AM • Calendar shows back-to-back meetings</p>
                  <p className="text-sm text-adhd-dark italic mb-3">
                    "Deep work block in 15 min but I see 3 meetings got added to your afternoon. Your energy data shows you do better with breaks between intense sessions. What feels right?"
                  </p>
                  <div className="space-y-1 text-xs text-adhd-gray mb-2">
                    <p>1️⃣ Move one meeting to create breathing room</p>
                    <p>2️⃣ Keep the schedule (I'll send energy check-ins)</p>
                    <p>3️⃣ Shorten the deep work block to prep for meetings</p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">✅ You chose: 1 - Smart call! That breathing room made all the difference.</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-xs text-gray-500 mb-2">Wednesday 4:00 PM • Henry time vs. urgent work request</p>
                  <p className="text-sm text-adhd-dark italic mb-3">
                    "Your calendar shows 'Henry Time' from 4-6 PM (marked sacred) but there's an urgent client request. Weather's perfect for that playground trip you planned. What's your call?"
                  </p>
                  <div className="space-y-1 text-xs text-adhd-gray mb-2">
                    <p>1️⃣ Honor Henry time (I'll handle the client gracefully)</p>
                    <p>2️⃣ Quick 30-min work then playground</p>
                    <p>3️⃣ Reschedule Henry time (family flexibility)</p>
                  </div>
                  <p className="text-xs text-purple-600 font-medium">✅ You chose: 1 - That playground laugh was worth everything! Client loved the thoughtful delay.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sunday Planning Email */}
        {activeTab === 'planning' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Email header */}
              <div className="bg-adhd-blue text-white p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <p className="font-semibold">goodberry</p>
                    <p className="text-sm opacity-75">hello@goodberry.ai</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    🌅 Sunday Planning Magic - Let's Design Your Week
                  </p>
                </div>
              </div>

              {/* Email content */}
              <div className="p-8">
                <p className="text-lg text-adhd-dark mb-6">
                  Hey Daniel! 🌅
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-adhd-dark mb-3">
                      ☀️ This Week's Energy Forecast
                    </h3>
                    <p className="text-adhd-gray">
                      Weather's looking good - sunny Tuesday (perfect for outdoor brainstorming!), 
                      light rain Thursday (cozy indoor focus day). Your calendar has some interesting 
                      opportunities for optimization...
                    </p>
                  </div>

                  <div className="bg-adhd-light p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-adhd-dark mb-3">
                      🧠 Here's What I'm Thinking for Your Week
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">🧠</span>
                        <div>
                          <p className="font-medium text-adhd-dark">Deep Work Blocks</p>
                          <p className="text-sm text-adhd-gray">Tuesday 9-11 AM (your brain's prime time!)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">🏠</span>
                        <div>
                          <p className="font-medium text-adhd-dark">Henry Time</p>
                          <p className="text-sm text-adhd-gray">Wednesday 4-6 PM (marked as absolutely sacred)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">🏕️</span>
                        <div>
                          <p className="font-medium text-adhd-dark">Camping Prep</p>
                          <p className="text-sm text-adhd-gray">Thursday evening when you're usually restless anyway</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">🛡️</span>
                        <div>
                          <p className="font-medium text-adhd-dark">Buffer Time</p>
                          <p className="text-sm text-adhd-gray">Friday afternoon - perfect for those "suddenly inspired" moments</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-xl font-bold text-adhd-dark mb-3">
                      ✨ The Magic Question
                    </h3>
                    <p className="text-adhd-gray mb-4">
                      How does this week feel? Does it honor your energy patterns AND leave room for life to happen?
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Love it! Schedule everything
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Tweak a few things first
                      </button>
                      <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        Let's start over
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Support Email */}
        {activeTab === 'followthrough' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Email header */}
              <div className="bg-adhd-blue text-white p-6">
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

              {/* Email content */}
              <div className="p-8">
                <p className="text-lg text-adhd-dark mb-6">
                  Good morning, Daniel! ☀️
                </p>

                <div className="space-y-6">
                  {/* 7-Day Weather Forecast */}
                  <div>
                    <h3 className="text-xl font-bold text-adhd-dark mb-3">
                      🌤️ Your Week's Weather Forecast
                    </h3>
                    <p className="text-adhd-gray mb-4">
                      Plan your energy and activities around the weather - because outdoor time = brain medicine!
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-7 gap-2 text-xs">
                        {/* Monday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Mon</div>
                          <div className="text-2xl mb-1">☀️</div>
                          <div className="text-gray-600">72°/55°</div>
                          <div className="text-gray-500 text-xs mt-1">Clear</div>
                        </div>
                        
                        {/* Tuesday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Tue</div>
                          <div className="text-2xl mb-1">🌤️</div>
                          <div className="text-gray-600">68°/52°</div>
                          <div className="text-gray-500 text-xs mt-1">Partly Cloudy</div>
                        </div>
                        
                        {/* Wednesday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Wed</div>
                          <div className="text-2xl mb-1">🌧️</div>
                          <div className="text-gray-600">61°/48°</div>
                          <div className="text-gray-500 text-xs mt-1">Light Rain</div>
                        </div>
                        
                        {/* Thursday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Thu</div>
                          <div className="text-2xl mb-1">⛅</div>
                          <div className="text-gray-600">65°/50°</div>
                          <div className="text-gray-500 text-xs mt-1">Overcast</div>
                        </div>
                        
                        {/* Friday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Fri</div>
                          <div className="text-2xl mb-1">🌤️</div>
                          <div className="text-gray-600">70°/54°</div>
                          <div className="text-gray-500 text-xs mt-1">Partly Cloudy</div>
                        </div>
                        
                        {/* Saturday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Sat</div>
                          <div className="text-2xl mb-1">☀️</div>
                          <div className="text-gray-600">75°/58°</div>
                          <div className="text-gray-500 text-xs mt-1">Sunny</div>
                        </div>
                        
                        {/* Sunday */}
                        <div className="text-center">
                          <div className="font-medium text-gray-700 mb-1">Sun</div>
                          <div className="text-2xl mb-1">☀️</div>
                          <div className="text-gray-600">73°/56°</div>
                          <div className="text-gray-500 text-xs mt-1">Clear</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-blue-700 bg-blue-100 rounded-lg p-3">
                        <strong>🌳 Brain-Friendly Weather Tips:</strong> Tuesday & Friday look perfect for Henry's outdoor time! 
                        Wednesday's rain = ideal cozy indoor focus day for deep work.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-adhd-dark mb-3">
                      🌅 Your Week at a Glance
                    </h3>
                    <p className="text-adhd-gray mb-4">
                      Weather's crisp and clear today (perfect focus energy!), and your calendar 
                      shows you've got some exciting wins lined up this week.
                    </p>
                    
                    <div className="bg-adhd-light p-4 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-adhd-dark">🧠 Deep Work: Business Plan</p>
                          <p className="text-adhd-gray">Today 9-11 AM (your prime time!)</p>
                        </div>
                        <div>
                          <p className="font-medium text-adhd-dark">📞 Client Strategy Call</p>
                          <p className="text-adhd-gray">Tuesday 2 PM (prep time built in)</p>
                        </div>
                        <div>
                          <p className="font-medium text-adhd-dark">🏠 Henry Adventure Time</p>
                          <p className="text-adhd-gray">Wednesday 4-6 PM (protected!)</p>
                        </div>
                        <div>
                          <p className="font-medium text-adhd-dark">🌊 Buffer Zone</p>
                          <p className="text-adhd-gray">Friday afternoon (flex time)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conscious Choice Moments Chart */}
                  <div className="p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">📈 Your Conscious Choice Moments</h4>
                    <p className="text-sm text-gray-600 mb-6">Times you paused and actively chose instead of reacting - building that self-awareness muscle!</p>
                    
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex items-center">
                        <span className="w-16 text-xs text-gray-500">Week 1:</span>
                        <div className="flex-1 bg-gray-200 rounded h-4 mr-2">
                          <div className="bg-blue-400 h-4 rounded" style={{width: '30%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600">8 moments</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-16 text-xs text-gray-500">Week 2:</span>
                        <div className="flex-1 bg-gray-200 rounded h-4 mr-2">
                          <div className="bg-blue-500 h-4 rounded" style={{width: '50%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600">14 moments</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-16 text-xs text-gray-500">Week 3:</span>
                        <div className="flex-1 bg-gray-200 rounded h-4 mr-2">
                          <div className="bg-blue-400 h-4 rounded" style={{width: '35%'}}></div>
                        </div>
                        <span className="text-xs text-gray-600">9 moments</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-16 text-xs text-purple-600 font-semibold">This week:</span>
                        <div className="flex-1 bg-gray-200 rounded h-4 mr-2">
                          <div className="bg-purple-500 h-4 rounded animate-pulse" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-xs text-purple-600 font-semibold">16 moments!</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-purple-700 bg-gray-50 rounded-lg p-3 border-l-4 border-purple-400">
                      <strong>💡 Growth Pattern:</strong> You're getting faster at recognizing choice moments and trusting your instincts. That's emotional regulation in action!
                    </div>
                  </div>

                  {/* Your Brain Patterns This Month */}
                  <div className="p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">🧠 Your Brain Patterns This Month</h4>
                    <p className="text-sm text-gray-600 mb-6">Look at how you're building better habits and making conscious choices that work with your ADHD brain.</p>
                    
                    <div className="space-y-3">
                      
                      {/* Sleep Choices */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">😴</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Sleep Choices</h6>
                          <p className="text-purple-600 font-medium text-xs">Getting better at bedtime decisions</p>
                        </div>
                      </div>

                      {/* Morning Momentum */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">⏰</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Morning Momentum</h6>
                          <p className="text-purple-600 font-medium text-xs">Starting days with intention 70% more often</p>
                        </div>
                      </div>

                      {/* Focus Blocks */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🧠</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Focus Blocks</h6>
                          <p className="text-purple-600 font-medium text-xs">Average session: 15 min → 28 min</p>
                        </div>
                      </div>

                      {/* Emotional Regulation */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🌊</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Emotional Regulation</h6>
                          <p className="text-purple-600 font-medium text-xs">Choosing mindful responses 80% more</p>
                        </div>
                      </div>

                      {/* Choice Awareness */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🎯</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Choice Awareness</h6>
                          <p className="text-purple-600 font-medium text-xs">Conscious decisions up 40%, weekly check-ins consistent</p>
                        </div>
                      </div>

                      {/* Energy Alignment */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">⚡</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Energy Alignment</h6>
                          <p className="text-purple-600 font-medium text-xs">Choosing flow states 3x more often</p>
                        </div>
                      </div>

                      {/* Response Confidence */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">💬</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Response Confidence</h6>
                          <p className="text-purple-600 font-medium text-xs">Quicker, more decisive replies</p>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                  {/* Brain Traps Successfully Avoided */}
                  <div className="p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">🛡️ Brain Traps Successfully Avoided</h4>
                    <p className="text-sm text-gray-600 mb-6">Your conscious choice-making is paying off! This month you skillfully navigated around ADHD brain traps that used to derail your progress.</p>
                    
                    <div className="space-y-3">
                      
                      {/* Doomscroll Sessions */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">📱</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Doomscroll Sessions</h6>
                          <p className="text-purple-600 font-medium text-xs">9 sessions redirected to meaningful activities</p>
                        </div>
                      </div>

                      {/* Gaming Spirals */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🎮</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Late-Night Gaming Spirals</h6>
                          <p className="text-purple-600 font-medium text-xs">6 spirals prevented with bedtime boundaries</p>
                        </div>
                      </div>

                      {/* Mindless Browsing */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🌐</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Mindless Browsing</h6>
                          <p className="text-purple-600 font-medium text-xs">12 sessions cut short with purpose checks</p>
                        </div>
                      </div>

                      {/* Energy Crashes */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">⚡</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Energy Crashes</h6>
                          <p className="text-purple-600 font-medium text-xs">4 crashes avoided with strategic breaks</p>
                        </div>
                      </div>

                      {/* Anxiety Spirals */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🌪️</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Anxiety Spirals</h6>
                          <p className="text-purple-600 font-medium text-xs">11 spirals interrupted with grounding techniques</p>
                        </div>
                      </div>

                      {/* Overthinking Loops */}
                      <div className="flex items-start space-x-3">
                        <span className="text-lg mt-0.5">🔄</span>
                        <div>
                          <h6 className="font-medium text-gray-900 text-sm">Overthinking Loops</h6>
                          <p className="text-purple-600 font-medium text-xs">7 loops dissolved with action steps</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Month's Biggest Win */}
                  <div className="p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">🏆 Month's Biggest Win</h4>
                    <p className="text-sm text-gray-600 mb-6">You're recognizing brain traps <strong className="text-purple-600">before</strong> they happen and choosing differently. That's not just habit building - that's rewiring your ADHD brain for success!</p>
                  </div>

                  {/* This Week's Gentle Opportunities */}
                  <div className="p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">🎯 Gentle Opportunities This Week</h4>
                    <p className="text-sm text-gray-600 mb-6">Some options to consider (totally optional, just here if they feel right):</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="font-medium text-gray-900">🧠 Tuesday Deep Work Session</p>
                        <p className="text-sm text-gray-600">9-11 AM is your sweet spot - maybe tackle that business plan outline?</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="font-medium text-gray-900">🌳 Wednesday Nature Break</p>
                        <p className="text-sm text-gray-600">Henry's excited about that park visit - outdoor time is brain medicine!</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="font-medium text-gray-900">⚡ Friday Flex Time</p>
                        <p className="text-sm text-gray-600">Perfect for whatever your brain wants to hyperfocus on</p>
                      </div>
                    </div>
                  </div>

                  {/* Choice Celebration */}
                  <div className="p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4">💖 Last Week's Choice Celebration</h4>
                    <p className="text-sm text-gray-600 mb-4">You chose to reschedule that Friday meeting when you felt overwhelmed - that's pure self-advocacy! And choosing the 20-minute focus session instead of forcing 60 minutes? Brilliant energy management.</p>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-400">
                      <p className="text-sm text-gray-700">
                        <strong className="text-purple-900">💡 Pattern we're seeing:</strong> You're trusting your instincts more and fighting your brain less. 
                        That's emotional regulation mastery in real time!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Differentiators */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-adhd-dark mb-2">Calendar-Aware Nudges</h3>
            <p className="text-adhd-gray">
              Texts that understand your schedule, energy patterns, and family commitments
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-adhd-dark mb-2">Choice Celebration</h3>
            <p className="text-adhd-gray">
              Every calendar decision honored - from perfect adherence to "creative interpretations"
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🌅</div>
            <h3 className="text-xl font-bold text-adhd-dark mb-2">Sunday → Friday Support</h3>
            <p className="text-adhd-gray">
              From planning anxiety to weekly wins - we're with you every step
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarEmailPreview; 
