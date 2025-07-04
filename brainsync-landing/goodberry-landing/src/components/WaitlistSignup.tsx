import React, { useState } from 'react';
import { addToWaitlist } from '../supabaseClient';

const WaitlistSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await addToWaitlist(email, name);
      
      if (result.success) {
        setSubmitted(true);
        setEmail('');
        setName('');
      } else {
        setError('Something went wrong. Please try again!');
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-emerald-800 via-green-700 to-teal-600 relative overflow-hidden">
        {/* D&D Fantasy Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-400 opacity-20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-teal-400 opacity-15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-400 opacity-25 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center text-white relative z-10">
          {/* Epic D&D Style Header */}
          <div className="text-7xl mb-6 animate-bounce">🫐✨</div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-emerald-100 font-serif tracking-wide">
            🗡️ Quest Accepted! 🛡️
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-emerald-200 italic">
            *The Goodberry has been added to your inventory*
          </h3>
          
          {/* D&D Lore Connection */}
          <div className="bg-black bg-opacity-40 rounded-2xl p-8 mb-8 max-w-4xl mx-auto backdrop-blur-sm border border-emerald-400 border-opacity-30">
            <div className="text-emerald-300 text-lg mb-4 font-serif italic">
              "In the ancient druidic traditions, a single goodberry could save an adventurer from death itself..."
            </div>
            <p className="text-xl mb-6 text-emerald-100 leading-relaxed">
              Just like the legendary goodberry spell that provides healing and nourishment to keep adventurers alive in the wilderness, 
              our <span className="text-emerald-300 font-bold">goodberry</span> app will nourish your ADHD brain and save your weeks from chaos.
            </p>
            <div className="text-emerald-200 text-lg">
              <strong>Your weekly survival kit is being prepared...</strong>
            </div>
          </div>

          {/* Inventory Style What Happens Next */}
          <div className="bg-amber-900 bg-opacity-60 rounded-xl p-8 max-w-3xl mx-auto backdrop-blur-sm border-2 border-amber-500 border-opacity-50 mb-8">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl mr-4">📜</span>
              <h3 className="text-2xl font-bold text-amber-100 font-serif">Quest Log Updated</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-amber-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🧙‍♂️</span>
                  <h4 className="font-bold text-amber-200">Druid's Email Scroll</h4>
                </div>
                <p className="text-amber-100 text-sm">Magical early access notifications will arrive via enchanted email when your goodberry is ready to cast</p>
              </div>
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-amber-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🗡️</span>
                  <h4 className="font-bold text-amber-200">Beta Adventurer Status</h4>
                </div>
                <p className="text-amber-100 text-sm">Join our party of ADHD adventurers testing the most powerful productivity magic ever created</p>
              </div>
              

              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-purple-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🎯</span>
                  <h4 className="font-bold text-purple-200">Influence the Magic</h4>
                </div>
                <p className="text-purple-100 text-sm">Help us craft spells that actually work for ADHD brains - your feedback shapes the magic</p>
              </div>
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-blue-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🧠</span>
                  <h4 className="font-bold text-blue-200">ADHD Brain Updates</h4>
                </div>
                <p className="text-blue-100 text-sm">Behind-the-scenes stories from our ADHD development team building magic that actually works</p>
              </div>
            </div>
          </div>

          {/* ADHD Coaching CTA */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-2xl p-8 border-2 border-purple-400 border-opacity-40 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-4">🏰</span>
              <h3 className="text-2xl font-bold text-purple-100 font-serif">Need Help Before Your Quest?</h3>
            </div>
            <p className="text-purple-200 text-lg mb-6 leading-relaxed">
              While you wait for your magical goodberry, join fellow ADHD adventurers at 
              <span className="text-purple-300 font-bold"> A Portland Career</span> for expert ADHD coaching and support.
            </p>
            <a 
              href="https://aportlandcareer.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-purple-400 border-opacity-30"
            >
              <span className="text-2xl mr-3">⚔️</span>
              Visit A Portland Career
              <span className="text-2xl ml-3">🏆</span>
            </a>
            <p className="text-purple-300 text-sm mt-4 italic">
              *Where ADHD brains learn to thrive in their careers*
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
          Ready to start celebrating your choices?
        </h2>
        <p className="text-xl mb-12 text-white opacity-90">
          Join the waitlist and be among the first ADHD brains to experience 
          gentle, choice-empowering daily guidance.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-white border-opacity-30 rounded-lg focus:border-white focus:outline-none transition-colors text-lg bg-white bg-opacity-90 text-gray-800 placeholder-gray-500"
            />
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-white border-opacity-30 rounded-lg focus:border-white focus:outline-none transition-colors text-lg bg-white bg-opacity-90 text-gray-800 placeholder-gray-500"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-200 bg-red-500 bg-opacity-20 p-3 rounded-lg border border-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-white text-blue-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            {isSubmitting ? 'Joining...' : 'Get My First Choice-Empowered Day'}
          </button>

          <p className="text-sm mt-4 text-white opacity-75">
            💙 No spam, just gentle guidance. Unsubscribe anytime.
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-semibold text-white">Built by ADHD brains</p>
            <p className="text-sm text-white opacity-75">We understand because we live it</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✨</div>
            <p className="font-semibold text-white">No new apps needed</p>
            <p className="text-sm text-white opacity-75">Works with what you already use</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💙</div>
            <p className="font-semibold text-white">Zero productivity guilt</p>
            <p className="text-sm text-white opacity-75">Choice celebration, not optimization</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSignup; 
