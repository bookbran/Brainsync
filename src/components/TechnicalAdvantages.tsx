import React from 'react';

const TechnicalAdvantages = () => {
  const advantages = [
    {
      emoji: "🚀",
      title: "Actually Works",
      description: "No more mysterious failures or parallel execution bugs",
      details: "Built with Node.js after hitting the limits of workflow tools"
    },
    {
      emoji: "🔧",
      title: "Full Control",
      description: "Every line of code optimized for ADHD brains",
      details: "Direct API integrations for maximum reliability"
    },
    {
      emoji: "💰",
      title: "Future-Proof",
      description: "No vendor lock-in, deploy anywhere",
      details: "Platform independent, scales infinitely"
    },
    {
      emoji: "⚡",
      title: "Lightning Fast",
      description: "Direct API calls, no middleware overhead",
      details: "Faster responses when you need choice support"
    },
    {
      emoji: "🛡️",
      title: "Transparent",
      description: "When something breaks, we know exactly why",
      details: "Complete debugging control and error visibility"
    },
    {
      emoji: "🌍",
      title: "Built to Last",
      description: "Modern architecture that grows with your needs",
      details: "No monthly platform fees or artificial limits"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-adhd-dark to-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Built right: No more{' '}
            <span className="text-adhd-blue">buggy workflows</span>{' '}
            or vendor lock-in
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We rebuilt from the ground up with Node.js after hitting the limits of workflow tools. 
            <span className="text-adhd-green font-semibold"> The result? A system that actually works.</span>
          </p>
        </div>

        {/* Advantages grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-4">{advantage.emoji}</div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {advantage.title}
              </h3>
              <p className="text-gray-300 mb-4">
                {advantage.description}
              </p>
              <p className="text-sm text-gray-400">
                {advantage.details}
              </p>
            </div>
          ))}
        </div>

        {/* Technical comparison */}
        <div className="bg-white bg-opacity-5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black mb-4">
              Why We Ditched n8n (And You Should Care)
            </h3>
            <p className="text-xl text-gray-300">
              We started with workflow platforms and hit every limitation in the book.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-red-400 mb-4">❌ n8n Problems We Eliminated:</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Parallel execution bugs with "undefined" errors</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Vendor lock-in with monthly fees and limitations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Black box debugging when things went wrong</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Platform dependency limiting deployment options</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Complex workflows hard to version control</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold text-green-400 mb-4">✅ Our Node.js Solution:</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Complete debugging control and error transparency</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Deploy anywhere: AWS, Vercel, Railway, your own server</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Every error traceable, every fix permanent</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Horizontal scaling with load balancers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Git-based development with proper testing</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-adhd-blue bg-opacity-20 rounded-lg p-6">
              <p className="text-lg font-semibold text-adhd-blue mb-2">
                The Bottom Line:
              </p>
              <p className="text-white">
                Your ADHD brain deserves technology that actually works. No more mysterious failures, 
                vendor limitations, or debugging nightmares. Just reliable, fast, choice-empowering support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalAdvantages; 