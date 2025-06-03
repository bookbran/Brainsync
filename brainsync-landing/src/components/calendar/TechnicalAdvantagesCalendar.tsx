import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const TechnicalAdvantagesCalendar = () => {
  const advantages = [
    {
      emoji: "🚀",
      title: "Calendar-Native AI",
      description: "Built specifically for ADHD-friendly time management",
      details: "Understands energy patterns, buffer needs, and transition challenges"
    },
    {
      emoji: "🔧",
      title: "Cross-Platform Sync",
      description: "Works seamlessly with Google, Outlook, Apple Calendar",
      details: "Real-time updates, no manual entry, zero friction"
    },
    {
      emoji: "💰",
      title: "ADHD-Optimized UX",
      description: "Every interface designed for executive function challenges",
      details: "Clear choices, gentle prompts, no overwhelming notifications"
    },
    {
      emoji: "⚡",
      title: "Real-Time Intelligence",
      description: "Smart suggestions that respect your current context",
      details: "Knows when you're in flow, when you need breaks, when to adapt"
    },
    {
      emoji: "🛡️",
      title: "Privacy by Design",
      description: "Calendar data stays secure, insights stay local",
      details: "No behavioral tracking, no location monitoring, full transparency"
    },
    {
      emoji: "🌍",
      title: "Evolving Platform",
      description: "Regular updates based on ADHD community needs",
      details: "Built by people who understand the Sunday planning anxiety"
    }
  ];

  return (
    <>
      {/* Labs/Future Integrations Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-6 py-3 rounded-full text-lg font-medium mb-8">
              <Sparkles className="w-5 h-5" />
              <span>🧪 Labs: Future Integrations</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Calendar First,
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Everything Else Later</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Here's the thing about ADHD brains: we get overwhelmed fast when there's too much happening at once. 
              So we're laser-focused on getting our calendar tool absolutely perfect first. But we're dreaming big about what's next...
            </p>
          </div>

          {/* Philosophy Box */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border-l-4 border-yellow-400 mb-16 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <Brain className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-900 text-xl mb-2">Our ADHD-First Philosophy</h3>
                <p className="text-yellow-800 text-lg leading-relaxed">
                  Rather than overwhelming you with 47 integrations on day one (hello, decision paralysis!), 
                  we're perfecting the calendar experience that actually works with ADHD brains. Once that's rock-solid, 
                  we'll thoughtfully add the integrations our community actually wants - not just because we can.
                </p>
              </div>
            </div>
          </div>

          {/* Apps We're Considering Grid */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Apps We're Bubbling About 🧪
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These are the integrations we're researching and considering. Which ones would actually help YOUR ADHD brain? 
                Your feedback drives our roadmap.
              </p>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {[
                { name: "Alarmy", icon: "⏰", category: "Sleep & Wake" },
                { name: "Forest", icon: "🌳", category: "Focus Sessions" },
                { name: "Headspace", icon: "🧘", category: "Mindfulness" },
                { name: "YNAB", icon: "💰", category: "Budget Awareness" },
                { name: "Oura Ring", icon: "💍", category: "Sleep Data" },
                { name: "Apple Health", icon: "🍎", category: "Wellness" },
                { name: "Spotify", icon: "🎵", category: "Focus Music" },
                { name: "RescueTime", icon: "⏰", category: "Digital Wellness" },
                { name: "Todoist", icon: "✅", category: "Task Management" },
                { name: "Notion", icon: "📝", category: "Knowledge Base" },
                { name: "Slack", icon: "💬", category: "Communication" },
                { name: "Zoom", icon: "💻", category: "Meeting Patterns" },
                { name: "Nike Run", icon: "👟", category: "Movement" },
                { name: "Samsung Health", icon: "📱", category: "Activity" },
                { name: "Habitica", icon: "🎮", category: "Gamification" }
              ].map((app, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{app.icon}</div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{app.name}</h4>
                  <p className="text-xs text-gray-600">{app.category}</p>
                </div>
              ))}
            </div>

            {/* Community Input */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-purple-900 mb-4">Help Us Build What You Actually Want</h4>
                <p className="text-purple-800 text-lg mb-6 max-w-2xl mx-auto">
                  Which of these would genuinely make your life easier? We're not building features to check boxes - 
                  we're building what our ADHD community actually needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Join the Conversation
                  </button>
                  <button className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    Share Your Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Advantages Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Calendar Technology Built by{' '}
              <span className="text-blue-300">ADHD Brains</span>
              {' '}for{' '}
              <span className="text-blue-300">ADHD Brains</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              We know what it's like when productivity tools make everything harder. 
              <span className="text-green-300 font-semibold"> That's why we built something that actually helps.</span>
            </p>
          </div>

          {/* Advantages grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {advantages.map((advantage, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-10">
                <div className="text-4xl mb-4">{advantage.emoji}</div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {advantage.title}
                </h3>
                <p className="text-gray-200 mb-4 font-medium">
                  {advantage.description}
                </p>
                <p className="text-sm text-gray-300">
                  {advantage.details}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar-specific benefits */}
          <div className="bg-white bg-opacity-5 rounded-2xl p-8 md:p-12 border border-white border-opacity-10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black mb-4 text-white">
                Why ADHD Adults Love Our Calendar Approach
              </h3>
              <p className="text-xl text-gray-200">
                Finally, time management that works WITH your brain, not against it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-green-300 mb-4">✨ What Makes Us Different:</h4>
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">•</span>
                    <span className="font-medium">Celebrates schedule changes as conscious choices</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">•</span>
                    <span className="font-medium">Protects 20% buffer time automatically</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">•</span>
                    <span className="font-medium">Adapts to energy patterns and flow states</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-300 mt-1">•</span>
                    <span className="font-medium">Sunday planning that actually reduces anxiety</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-300 mb-4">💙 Built for Your Reality:</h4>
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-300 mt-1">•</span>
                    <span className="font-medium">Works with your existing calendar apps</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-300 mt-1">•</span>
                    <span className="font-medium">Weather-aware scheduling suggestions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-300 mt-1">•</span>
                    <span className="font-medium">Gentle nudges via text - no app switching</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-blue-300 mt-1">•</span>
                    <span className="font-medium">Family-friendly with kid-time protection</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-20 rounded-lg p-6 border border-white border-opacity-10">
                <p className="text-lg font-semibold text-blue-200 mb-2">
                  🧠 For ADHD Planning:
                </p>
                <p className="text-white">
                  Stop fighting your brain's natural patterns. Our AI learns when you're most productive, 
                  when you need breaks, and how to optimize your schedule for neurodivergent success.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-500 bg-opacity-20 rounded-lg p-6 border border-white border-opacity-10">
                <p className="text-lg font-semibold text-green-200 mb-2">
                  💙 For ADHD Follow-Through:
                </p>
                <p className="text-white">
                  Get support all week long with gentle nudges that celebrate your choices and adapt 
                  when life happens. Because the best plans are the ones that flex with reality.
                </p>
              </div>
            </div>
          </div>

          {/* The Technical Details */}
          <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Technical Excellence for Calendar Management
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-bold text-blue-300 mb-2">Real-Time Sync</h4>
                <p className="text-gray-300 text-sm">
                  Calendar changes reflect instantly across all platforms. No delays, no missed updates, 
                  no confusion about what's actually scheduled.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="font-bold text-green-300 mb-2">Calendar-Only Access</h4>
                <p className="text-gray-300 text-sm">
                  We only read your calendar events - no emails, files, or personal data. 
                  Just scheduling information to provide helpful suggestions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="font-bold text-purple-300 mb-2">ADHD-Aware AI</h4>
                <p className="text-gray-300 text-sm">
                  Machine learning trained specifically on ADHD time management patterns. 
                  Understands executive function, energy cycles, and transition needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TechnicalAdvantagesCalendar; 