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
                  <p className="font-semibold">goodberry</p>
                  <p className="text-sm opacity-75">goodberry@aportlandcareer.com</p>
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
                    <li>• Forest shows focus sessions getting longer - maybe try 45 minutes today? 🌳</li>
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
                  <p className="text-adhd-gray mt-3">
                    I noticed your calendar patterns show you're getting better at conscious choice-making 
                    - you actively chose to take a break when you felt overwhelmed instead of forcing productivity. 
                    That's incredible self-awareness! Your scheduling data shows you're learning to honor your energy levels 
                    and work WITH your brain patterns instead of against them. 🌱
                  </p>
                  <p className="text-adhd-gray mt-3">
                    Your choice responses show you're building emotional regulation skills - when you felt stressed 
                    yesterday, you chose the 3-minute breathing option instead of doom-scrolling. That's pure wisdom! 
                    Plus your weekly planning reviews show you're staying mindful of your goals and celebrating 
                    small wins - that awareness is everything. 💙
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-adhd-dark mb-3">
                    🎉 This Week So Far
                  </h3>
                  <div className="bg-adhd-light p-4 rounded-lg mb-4">
                    <ul className="text-adhd-dark space-y-1 text-sm">
                      <li>• 12 conscious choice moments (you paused and decided!)</li>
                      <li>• 4 times you chose rest over pushing through</li>
                      <li>• 3 flow states you honored instead of interrupting</li>
                      <li>• 2 meetings you rescheduled to match your energy</li>
                      <li>• 5 mornings you chose wake-up missions over snoozing (Alarmy)</li>
                      <li>• 8 focused Forest sessions completed without phone distractions</li>
                      <li>• 3 times you chose shorter focus blocks when energy was low</li>
                      <li>• 6 moments you chose Headspace breathing over anxiety spiraling</li>
                      <li>• 1 mindful YNAB budget check-in completed (awareness building!)</li>
                    </ul>
                  </div>

                  {/* Simplified Conscious Choice Chart */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-6">
                    <h4 className="text-lg font-semibold text-adhd-dark mb-4">📈 Your Conscious Choice Moments</h4>
                    <p className="text-sm text-adhd-gray mb-4">Times you paused and actively chose instead of reacting</p>
                    
                    <div className="space-y-2 font-mono text-sm">
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
                        <span className="w-16 text-xs text-blue-600 font-semibold">This week:</span>
                        <div className="flex-1 bg-gray-200 rounded h-4 mr-2">
                          <div className="bg-purple-500 h-4 rounded animate-pulse" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-xs text-blue-600 font-semibold">12 moments!</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Vibe Check Dashboard */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 mb-6">
                    <h4 className="text-lg font-semibold text-adhd-dark mb-4">🧠 Your Brain Patterns This Month</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">😴</span>
                        <span className="flex-1 text-adhd-dark">Sleep Choices:</span>
                        <span className="text-green-600 font-medium">Getting better at bedtime decisions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">⏰</span>
                        <span className="flex-1 text-adhd-dark">Morning Momentum:</span>
                        <span className="text-green-600 font-medium">Starting days with intention 70% more often</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🧠</span>
                        <span className="flex-1 text-adhd-dark">Focus Blocks:</span>
                        <span className="text-green-600 font-medium">Average session length increased from 15 to 28 minutes</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🌊</span>
                        <span className="flex-1 text-adhd-dark">Emotional Regulation:</span>
                        <span className="text-green-600 font-medium">Choosing mindful responses over overwhelm 80% more</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🎯</span>
                        <span className="flex-1 text-adhd-dark">Choice Awareness:</span>
                        <span className="text-green-600 font-medium">Conscious decision-making up 40%, weekly check-ins consistent</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">📱</span>
                        <span className="flex-1 text-adhd-dark">Evening Patterns:</span>
                        <span className="text-green-600 font-medium">60% fewer late-night doom scrolls</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">⚡</span>
                        <span className="flex-1 text-adhd-dark">Energy Alignment:</span>
                        <span className="text-green-600 font-medium">Choosing flow states 3x more often</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">💬</span>
                        <span className="flex-1 text-adhd-dark">Response Confidence:</span>
                        <span className="text-green-600 font-medium">Quicker, more decisive replies</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Text Nudge Examples */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
                    <h4 className="text-lg font-semibold text-adhd-dark mb-4">📱 Your Real-Time Choice Prompts This Week</h4>
                    <p className="text-sm text-adhd-gray mb-4">Examples of gentle nudges using your app data:</p>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
                        <p className="text-xs text-gray-500 mb-2">Tuesday 10:30 PM • Alarmy detects late screen time</p>
                        <p className="text-sm text-adhd-dark italic">
                          "Brain check! Your Alarmy shows you do better with 7am wake-ups when you sleep by 11pm. It's 10:30 - what feels right? Reply 1, 2, or 3:"
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-adhd-gray">
                          <p>1️⃣ Wind down now (I'll play your sleep sounds)</p>
                          <p>2️⃣ 15 more minutes then bed</p>
                          <p>3️⃣ Night owl mode tonight (adjust tomorrow's wake-up)</p>
                        </div>
                        <p className="text-xs text-green-600 mt-2 font-medium">✅ You chose: 2 - Got those 15 minutes and felt good about the choice!</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                        <p className="text-xs text-gray-500 mb-2">Thursday 2:15 PM • Forest session interrupted by meeting invite</p>
                        <p className="text-sm text-adhd-dark italic">
                          "Your Forest tree has 15 minutes left but there's a new urgent meeting request. Your recent data shows you do better honoring flow states. What feels right?"
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-adhd-gray">
                          <p>1️⃣ Keep the tree growing (I'll suggest alternative times)</p>
                          <p>2️⃣ Save progress & take meeting (your 15 min still counts!)</p>
                          <p>3️⃣ Quick 5-min check then back to focus</p>
                        </div>
                        <p className="text-xs text-purple-600 mt-2 font-medium">✅ You chose: 1 - Honored your flow and the meeting got rescheduled!</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-xs text-gray-500 mb-2">Friday 3:30 PM • Headspace detects rising stress patterns</p>
                        <p className="text-sm text-adhd-dark italic">
                          "Your calendar shows back-to-back meetings and Headspace data suggests you do better with breathing breaks between intense sessions. Quick choice?"
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-adhd-gray">
                          <p>1️⃣ 3-minute breathing session (your go-to)</p>
                          <p>2️⃣ 10-minute walking meditation</p>
                          <p>3️⃣ Power through (I'll check in again later)</p>
                        </div>
                        <p className="text-xs text-blue-600 mt-2 font-medium">✅ You chose: 1 - That breath work really reset your energy!</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-xs text-gray-500 mb-2">Sunday 7:00 PM • YNAB weekly budget check-in</p>
                        <p className="text-sm text-adhd-dark italic">
                          "Weekly budget review time! YNAB shows you're doing great this month and hit your savings goal. How do you want to celebrate this win?"
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-adhd-gray">
                          <p>1️⃣ Treat yourself mindfully (within fun budget)</p>
                          <p>2️⃣ Add extra to savings goal</p>
                          <p>3️⃣ Just celebrate the awareness (that's huge!)</p>
                        </div>
                        <p className="text-xs text-yellow-600 mt-2 font-medium">✅ You chose: 3 - Celebrating your financial mindfulness is powerful!</p>
                      </div>
                    </div>
                  </div>

                  {/* Transformation Story */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="text-lg font-semibold text-adhd-dark mb-4">🌱 From Hostage to Empowered</h4>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-300 pl-4 py-2 bg-red-50 rounded">
                        <p className="text-sm text-gray-600 font-medium mb-1">Week 1:</p>
                        <p className="text-sm text-adhd-dark italic">
                          "It's 3am, I'm watching Netflix again, knowing I'll be exhausted tomorrow. I feel like such a failure."
                        </p>
                      </div>
                      
                      <div className="flex justify-center">
                        <span className="text-2xl">↓</span>
                      </div>
                      
                      <div className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded">
                        <p className="text-sm text-gray-600 font-medium mb-1">Week 8:</p>
                        <p className="text-sm text-adhd-dark italic">
                          "I got that choice text at 10:30pm - Netflix or sleep? I actually chose sleep and felt proud of myself. This morning I woke up ready for the day."
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded border-l-4 border-purple-400">
                      <p className="text-sm text-adhd-dark">
                        <strong>💜 The real magic:</strong> You're not just making more conscious choices - you're breaking free from patterns that held you hostage. Every choice moment is building your confidence to trust yourself.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email footer */}
            <div className="bg-gray-50 p-6 text-center">
              <p className="text-sm text-adhd-gray">
                goodberry - Celebrating your choices, honoring your brain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailPreview; 
