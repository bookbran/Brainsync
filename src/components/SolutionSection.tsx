import React from 'react';

const SolutionSection = () => {
  const features = [
    {
      emoji: "🎯",
      title: "Choice Celebration",
      description: "Honors ALL decisions as conscious choices, even 'unproductive' ones",
      benefit: "Finally, an AI that doesn't judge your Netflix binges"
    },
    {
      emoji: "🤗",
      title: "Gentle Guidance",
      description: "Zero guilt, maximum understanding - like an ADHD friend who gets it",
      benefit: "Prompts that make you smile, not stressed"
    },
    {
      emoji: "🧠",
      title: "ADHD-Native AI",
      description: "Understands executive function, energy cycles, and the need for autonomy",
      benefit: "Built FOR ADHD brains, not forced onto them"
    },
    {
      emoji: "🔗",
      title: "Connects Everything",
      description: "Google Calendar + Habitica + Weather + Sleep data (actually works!)",
      benefit: "All your scattered apps finally talking to each other"
    },
    {
      emoji: "📧",
      title: "Email Delivery",
      description: "No new app to check - gentle insights come to you",
      benefit: "One less thing to remember to open"
    },
    {
      emoji: "⚡",
      title: "Real-Time Choice Support",
      description: "Smart nudges at transition points: 'Keep flowing or switch gears?'",
      benefit: "Support exactly when you need it most"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            What if your AI{' '}
            <span className="text-adhd-green">celebrated your choices</span>{' '}
            instead of judging them?
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            BrainSync Pro is the first AI agent that analyzes ALL your data to deliver 
            gentle, choice-celebrating guidance that honors your ADHD brain.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="choice-card text-center">
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

        {/* Choice Philosophy Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-adhd-dark mb-4">
              Your choices matter more than your productivity
            </h3>
            <p className="text-xl text-adhd-gray">
              BrainSync Pro is built on a revolutionary philosophy: choice empowerment over compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-bold text-adhd-dark mb-2">Choice Over Compliance</h4>
              <p className="text-sm text-adhd-gray">We measure self-awareness, not task completion</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💖</div>
              <h4 className="font-bold text-adhd-dark mb-2">Gentle Over Guilt</h4>
              <p className="text-sm text-adhd-gray">Understanding prompts that invite reflection without pressure</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌱</div>
              <h4 className="font-bold text-adhd-dark mb-2">Progress Through Awareness</h4>
              <p className="text-sm text-adhd-gray">Growth comes from conscious choices, not forced habits</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎪</div>
              <h4 className="font-bold text-adhd-dark mb-2">Permission to Be Human</h4>
              <p className="text-sm text-adhd-gray">Normalize ADHD struggles and 'unproductive' choices</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection; 