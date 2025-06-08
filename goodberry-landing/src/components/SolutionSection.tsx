import React from 'react';

const SolutionSection = () => {
  const features = [
    {
      emoji: "🎯",
      title: "Choice Celebration",
      description: "Honors ALL decisions as conscious choices, even 'unproductive' ones—transforming guilt into empowerment",
      benefit: "Finally, an AI that doesn't judge your Netflix binges but celebrates your self-awareness"
    },
    {
      emoji: "🤗",
      title: "Gentle Guidance",
      description: "Zero guilt, maximum understanding - like an ADHD friend who gets it and guides you to feel empowered",
      benefit: "Prompts that make you smile, not stressed—gentle nudges from stuck to celebrated"
    },
    {
      emoji: "🧠",
      title: "ADHD-Native AI",
      description: "Understands executive function, energy cycles, and the need for autonomy—built to empower, not judge",
      benefit: "Built FOR ADHD brains to feel celebrated, not forced into neurotypical molds"
    },
    {
      emoji: "🔗",
      title: "Connects Everything",
      description: "Google Calendar + Habitica + Weather + Sleep data that actually empowers your choices",
      benefit: "All your scattered apps finally talking to each other to celebrate your unique patterns"
    },
    {
      emoji: "📧",
      title: "Email Delivery",
      description: "No new app to check - gentle insights that celebrate your journey come to you",
      benefit: "One less thing to remember to open—empowerment delivered, not demanded"
    },
    {
      emoji: "⚡",
      title: "Real-Time Choice Support",
      description: "Smart nudges at transition points that celebrate conscious choice-making: 'Keep flowing or switch gears?'",
      benefit: "Support exactly when you need it most—transforming overwhelm into empowered decisions"
    }
  ];

  const dataSources = [
    { name: "Google Calendar", icon: "📅", description: "Events & scheduling" },
    { name: "Habitica", icon: "🎮", description: "Habit tracking & rewards" },
    { name: "Alarmy", icon: "⏰", description: "Sleep patterns & wake-up habits" },
    { name: "Forest", icon: "🌳", description: "Focus sessions & productivity tracking" },
    { name: "OpenWeather", icon: "🌤️", description: "Weather & mood patterns" },
    { name: "Oura Ring", icon: "💍", description: "Sleep & recovery data" },
    { name: "Apple Health", icon: "🍎", description: "Activity & wellness" },
    { name: "Samsung Health", icon: "📱", description: "Step & fitness tracking" },
    { name: "Nike Run Club", icon: "👟", description: "Running & motivation" },
    { name: "Spotify", icon: "🎵", description: "Music & mood analysis" },
    { name: "RescueTime", icon: "⏰", description: "Digital wellness tracking" },
    { name: "Todoist", icon: "✅", description: "Task management" },
    { name: "Notion", icon: "📝", description: "Notes & knowledge base" },
    { name: "Slack", icon: "💬", description: "Team communication patterns" },
    { name: "Headspace", icon: "🧘", description: "Meditation & emotional regulation" },
    { name: "YNAB", icon: "💰", description: "Budgeting & financial planning" }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            What if your AI{' '}
            <span className="text-adhd-green">celebrated your choices</span>{' '}
            and empowered your journey?
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            goodberry is the first AI agent that transforms your relationship with productivity—analyzing ALL your data to deliver 
            gentle, choice-celebrating guidance that turns daily overwhelm into{' '}
            <span className="adhd-highlight">empowered self-awareness</span>.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="choice-card-green text-center">
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold text-adhd-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-adhd-gray mb-4">
                {feature.description}
              </p>
              <div className="bg-adhd-light p-3 rounded-lg">
                <p className="text-sm font-medium text-adhd-dark">
                  {feature.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Data Sources Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-adhd-dark mb-4">
              Connects with{' '}
              <span className="text-blue-600">all your favorite apps</span>
            </h3>
            <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
              No more manual data entry. goodberry automatically gathers insights from the tools you already use, 
              <span className="adhd-highlight">creating a complete picture of your unique patterns</span> to celebrate and empower your choices.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dataSources.map((source, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center">
                <div className="text-3xl mb-2">{source.icon}</div>
                <h4 className="font-bold text-adhd-dark text-sm mb-1">{source.name}</h4>
                <p className="text-xs text-adhd-gray">{source.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-4xl mx-auto">
              <p className="text-lg text-adhd-dark font-semibold mb-2">
                🔄 <strong>Smart Data Fusion</strong>
              </p>
              <p className="text-adhd-gray">
                Our AI doesn't just collect data—it finds the hidden connections that empower your choices. Like how your sleep quality affects your 
                calendar scheduling decisions, or how weather patterns influence your Habitica completion rates. 
                <span className="font-semibold text-blue-600">Finally, insights that actually make sense for ADHD brains and celebrate your patterns.</span>
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 max-w-4xl mx-auto mt-4">
              <p className="text-lg text-adhd-dark font-semibold mb-2">
                🔒 <strong>Privacy-First Design</strong>
              </p>
              <p className="text-adhd-gray">
                We only collect data you explicitly choose to share through your connected apps - no browsing tracking, 
                location monitoring, or behavioral surveillance. Your financial data stays in your control, and you can 
                disconnect any app at any time. <span className="font-semibold text-green-600">Gentle guidance, not creepy tracking.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Choice Philosophy Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-adhd-dark mb-4">
              Transform from stuck and judged to celebrated and empowered
            </h3>
            <p className="text-xl text-adhd-gray">
              goodberry is built on a revolutionary philosophy: choice empowerment over compliance, 
              self-awareness mastery over productivity pressure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-bold text-adhd-dark mb-2">Choice Over Compliance</h4>
              <p className="text-sm text-adhd-gray">We measure self-awareness growth, not task completion—celebrating every conscious decision</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💖</div>
              <h4 className="font-bold text-adhd-dark mb-2">Gentle Over Guilt</h4>
              <p className="text-sm text-adhd-gray">Understanding prompts that celebrate reflection without pressure—transforming overwhelm to empowerment</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌱</div>
              <h4 className="font-bold text-adhd-dark mb-2">Progress Through Awareness</h4>
              <p className="text-sm text-adhd-gray">Growth comes from conscious choices that celebrate your brain—not forced habits that judge it</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎪</div>
              <h4 className="font-bold text-adhd-dark mb-2">Permission to Be Human</h4>
              <p className="text-sm text-adhd-gray">Normalize ADHD struggles and celebrate 'unproductive' choices as conscious self-care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection; 
