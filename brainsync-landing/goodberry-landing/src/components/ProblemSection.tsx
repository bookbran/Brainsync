import React from 'react';

const ProblemSection = () => {
  const problems = [
    {
      emoji: "📱",
      text: "You use 5 different apps but they never talk to each other",
      subtext: "Calendar says one thing, habit tracker says another, weather app is ignored—you're stuck managing fragments instead of living your life"
    },
    {
      emoji: "😤",
      text: "Productivity advice makes you feel guilty for being human",
      subtext: "Every app judges your 'unproductive' choices instead of understanding them—leaving you feeling broken and stuck"
    },
    {
      emoji: "🔄",
      text: "Your calendar says one thing, your energy says another",
      subtext: "Planned 'deep work' during your natural crash time? Recipe for ADHD disaster and more self-judgment"
    },
    {
      emoji: "📊",
      text: "You know tracking helps, but the insights never come",
      subtext: "All this data collection but zero intelligence about what it means—you're stuck with numbers, not wisdom"
    },
    {
      emoji: "🎯",
      text: "You want gentle guidance, not another system telling you what to do",
      subtext: "Tired of productivity tools that feel like a demanding parent—you're judged, not supported"
    },
    {
      emoji: "🧠",
      text: "Every productivity tool feels built for neurotypical brains",
      subtext: "Cookie-cutter advice that ignores how ADHD brains actually work—you're stuck feeling like a square peg in a round hole"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-adhd-dark mb-6">
            Tired of feeling{' '}
            <span className="text-adhd-purple">stuck and judged</span>{' '}
            by productivity tools?
          </h2>
          <p className="text-xl text-adhd-gray max-w-3xl mx-auto">
            If these sound familiar, you're in the right place. We built goodberry because 
            we were <span className="adhd-highlight">tired of the same problems</span> too—and ready to 
            transform from stuck to empowered.
          </p>
        </div>

        {/* Problems grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="choice-card-purple group cursor-pointer">
              <div className="text-4xl mb-4">{problem.emoji}</div>
              <h3 className="text-xl font-bold text-adhd-dark mb-3 group-hover:text-adhd-blue transition-colors">
                {problem.text}
              </h3>
              <p className="text-adhd-gray">
                {problem.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Emotional connection with 3am story elements */}
        <div className="mt-16 text-center">
          <div className="bg-adhd-light p-8 rounded-xl max-w-4xl mx-auto border-l-4 border-adhd-orange">
            <p className="text-2xl font-semibold text-adhd-dark mb-4">
              "Remember that 3am feeling—watching Netflix, knowing you'll be exhausted tomorrow, 
              feeling like such a failure? I'm so tired of apps that make me feel broken instead of celebrated."
            </p>
            <p className="text-adhd-gray">
              — Every ADHD brain stuck in the productivity guilt cycle
            </p>
          </div>
        </div>

        {/* Transition to solution */}
        <div className="mt-16 text-center">
          <p className="text-xl text-adhd-gray mb-6">
            What if there was a different way? What if instead of staying stuck and judged, 
            you could feel <span className="text-adhd-green font-semibold">celebrated and empowered</span> through conscious choices?
          </p>
          <div className="inline-flex items-center space-x-2 text-adhd-blue font-semibold">
            <span>Let us show you how to transform</span>
            <span className="text-2xl">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection; 
