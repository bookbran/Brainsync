import React from 'react';

const TechnicalAdvantages = () => {
  const advantages = [
    {
      emoji: "🚀",
      title: "Lightning Reliable",
      description: "Built for the long haul with enterprise-grade reliability",
      details: "No mysterious failures or downtime when you need support most"
    },
    {
      emoji: "🔧",
      title: "ADHD-Optimized",
      description: "Every feature designed specifically for neurodivergent brains",
      details: "Fast responses, clear interfaces, gentle interactions"
    },
    {
      emoji: "💰",
      title: "Future-Proof",
      description: "Independent platform that grows with your needs",
      details: "No vendor lock-in or surprise pricing changes"
    },
    {
      emoji: "⚡",
      title: "Instant Support",
      description: "Real-time choice guidance when you need it most",
      details: "Smart notifications at exactly the right moments"
    },
    {
      emoji: "🛡️",
      title: "Privacy First",
      description: "Your data stays secure and private, always",
      details: "Complete transparency about how your information is used"
    },
    {
      emoji: "🌍",
      title: "Continuously Improving",
      description: "Regular updates based on ADHD community feedback",
      details: "Built by and for people who understand the struggle"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Built right: Technology that{' '}
            <span className="text-blue-300">actually supports</span>{' '}
            ADHD brains
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            We've experienced every frustration with productivity tools. That's why we built 
            <span className="text-green-300 font-semibold"> something completely different.</span>
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

        {/* User-focused benefits */}
        <div className="bg-white bg-opacity-5 rounded-2xl p-8 md:p-12 border border-white border-opacity-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black mb-4 text-white">
              Why ADHD Brains Love BrainSync Pro
            </h3>
            <p className="text-xl text-gray-200">
              Finally, technology that works WITH your brain, not against it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-green-300 mb-4">✨ What Makes Us Different:</h4>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start space-x-3">
                  <span className="text-green-300 mt-1">•</span>
                  <span className="font-medium">Celebrates ALL choices, even "unproductive" ones</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-300 mt-1">•</span>
                  <span className="font-medium">Gentle guidance that reduces overwhelm</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-300 mt-1">•</span>
                  <span className="font-medium">Smart timing that respects your flow states</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-300 mt-1">•</span>
                  <span className="font-medium">Zero guilt, maximum understanding</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold text-blue-300 mb-4">💙 Built for Your Success:</h4>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">•</span>
                  <span className="font-medium">Connects all your scattered apps seamlessly</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">•</span>
                  <span className="font-medium">Learns your patterns without being creepy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">•</span>
                  <span className="font-medium">Works through email - no new app to remember</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-blue-300 mt-1">•</span>
                  <span className="font-medium">Affordable pricing that respects ADHD budgets</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-20 rounded-lg p-6 border border-white border-opacity-10">
              <p className="text-lg font-semibold text-blue-200 mb-2">
                The Bottom Line:
              </p>
              <p className="text-white text-lg">
                Your ADHD brain deserves technology that celebrates your uniqueness, not something that tries to "fix" you. 
                BrainSync Pro is choice empowerment, not productivity pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalAdvantages; 