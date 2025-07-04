import React from 'react';
import { 
  RefreshCw
} from 'lucide-react';

const ConsciousChoiceSection = () => {
  return (
    <section id="choice" className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Every Calendar Decision is a{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Conscious Choice</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Follow your schedule, adapt it, or throw it out completely. 
            <span className="font-bold text-yellow-300"> We celebrate all of it.</span>
          </p>
        </div>

        {/* Four Types of Choices */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Follow the Plan
            </h3>
            <p className="text-white/80">
              Honor your future self's intentions
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🌊</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Adapt the Plan
            </h3>
            <p className="text-white/80">
              Respond to what's actually happening
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Follow Your Flow
            </h3>
            <p className="text-white/80">
              Honor your hyperfocus and energy
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Pivot Completely
            </h3>
            <p className="text-white/80">
              Choose what you actually need
            </p>
          </div>
        </div>

        {/* Simple Examples */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-16 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            This Week's Celebrations
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-white/90">
                "You moved your 9 AM meeting to 10 AM for transition time. That's executive function wisdom!"
              </p>
            </div>
            
            <div className="bg-blue-500/20 backdrop-blur-sm p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-white/90">
                "Your 'quick email check' became 2 hours of inbox mastery. You followed your hyperfocus!"
              </p>
            </div>
            
            <div className="bg-purple-500/20 backdrop-blur-sm p-4 rounded-lg border-l-4 border-purple-400">
              <p className="text-sm text-white/90">
                "Henry needed playground time, so you used your buffer period. Values-aligned choice!"
              </p>
            </div>
            
            <div className="bg-yellow-500/20 backdrop-blur-sm p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-white/90">
                "You cancelled afternoon meetings when energy crashed. That's honoring your limits!"
              </p>
            </div>
          </div>
        </div>

        {/* Permission to Pivot */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Permission to Pivot</h3>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Every plan comes with built-in permission to change. Adapting isn't failing - it's using your ADHD 
            superpower of reading the room and making conscious choices in real time.
            <strong className="text-yellow-300"> Flexibility is intelligence, not weakness.</strong>
          </p>
          
          <a 
            href="#waitlist" 
            className="mt-6 bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Celebrating Your Choices
          </a>
        </div>
      </div>
    </section>
  );
};

export default ConsciousChoiceSection; 
