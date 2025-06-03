import React from 'react';

const CalendarIntegrationSection = () => {
  const calendarIntegrations = [
    { name: "Google Calendar", icon: "📅", description: "Primary calendar sync & scheduling", highlight: true },
    { name: "Outlook Calendar", icon: "📧", description: "Microsoft calendar integration", highlight: true },
    { name: "Apple Calendar", icon: "🍎", description: "iCloud calendar sync", highlight: true },
    { name: "Calendly", icon: "🗓️", description: "Meeting scheduling automation" },
    { name: "Zoom", icon: "💻", description: "Video meeting patterns" },
    { name: "Teams", icon: "👥", description: "Microsoft collaboration sync" },
    { name: "Slack", icon: "💬", description: "Team communication patterns" },
    { name: "Notion Calendar", icon: "📝", description: "Notion workspace scheduling" },
    { name: "Todoist", icon: "✅", description: "Task-to-calendar integration" },
    { name: "RescueTime", icon: "⏰", description: "Time tracking insights" },
    { name: "Google Tasks", icon: "✅", description: "Primary task management & planning", highlight: true },
    { name: "OpenWeather", icon: "🌤️", description: "Weather-based planning" }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            Connects with{' '}
            <span className="text-adhd-blue">your entire scheduling ecosystem</span>
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            BrainSync Pro syncs with all your calendar and productivity tools, creating a unified view of your time 
            that actually makes sense for ADHD brains.{' '}
            <span className="adhd-highlight">No more app switching. No more missed connections.</span>
          </p>
        </div>

        {/* Integration grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {calendarIntegrations.map((integration, index) => (
            <div 
              key={index} 
              className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center ${
                integration.highlight 
                  ? 'border-adhd-blue hover:border-blue-600' 
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">{integration.icon}</div>
              <h4 className={`font-bold text-sm mb-1 ${
                integration.highlight ? 'text-adhd-blue' : 'text-adhd-dark'
              }`}>
                {integration.name}
              </h4>
              <p className="text-xs text-adhd-gray">{integration.description}</p>
              {integration.highlight && (
                <div className="mt-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Primary</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Smart Calendar Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-adhd-dark mb-4">🧠 ADHD-Smart Calendar Sync</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="font-semibold text-adhd-dark">Energy Pattern Recognition</h4>
                  <p className="text-sm text-adhd-gray">Learns when you're most productive and suggests optimal scheduling</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <h4 className="font-semibold text-adhd-dark">Buffer Time Protection</h4>
                  <p className="text-sm text-adhd-gray">Automatically protects 20% of your time for transitions and unexpected needs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg">🎯</span>
                <div>
                  <h4 className="font-semibold text-adhd-dark">Context Switching Intelligence</h4>
                  <p className="text-sm text-adhd-gray">Groups similar tasks and warns about difficult transitions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-adhd-dark mb-4">🌊 Flexible Flow Management</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-lg">🔄</span>
                <div>
                  <h4 className="font-semibold text-adhd-dark">Real-Time Adaptability</h4>
                  <p className="text-sm text-adhd-gray">Instantly adjusts when you need to honor flow states or handle emergencies</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg">🌤️</span>
                <div>
                  <h4 className="font-semibold text-adhd-dark">Weather-Aware Planning</h4>
                  <p className="text-sm text-adhd-gray">Factors in weather patterns that affect your energy and mood</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg">💙</span>
                <div>
                  <h4 className="font-semibold text-adhd-dark">No-Judgment Rescheduling</h4>
                  <p className="text-sm text-adhd-gray">Celebrates conscious choice to change plans rather than forcing adherence</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Excellence */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-adhd-dark mb-4">
              Seamless Integration, Maximum Privacy
            </h3>
            <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
              Enterprise-grade security meets ADHD-friendly simplicity. Your calendar data stays secure 
              while our AI provides the support you actually need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-bold text-adhd-dark mb-2">Calendar-Only Access</h4>
              <p className="text-sm text-adhd-gray">
                We only read your calendar events - no emails, documents, or personal files. Just scheduling data.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-bold text-adhd-dark mb-2">Real-Time Sync</h4>
              <p className="text-sm text-adhd-gray">
                Changes to your calendar are reflected instantly - no delays, no missed updates.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-adhd-dark mb-2">Smart Suggestions Only</h4>
              <p className="text-sm text-adhd-gray">
                We suggest optimizations but never make changes without your explicit approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarIntegrationSection; 