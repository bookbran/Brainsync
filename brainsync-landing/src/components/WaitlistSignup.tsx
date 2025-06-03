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
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Welcome to the Choice Revolution!
          </h2>
          <p className="text-xl mb-8 text-white opacity-90">
            You're officially on the BrainSync Pro waitlist! We'll email you the moment 
            we're ready to start celebrating your choices.
          </p>
          <div className="bg-white bg-opacity-20 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-lg text-white font-semibold">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-left mt-4 space-y-2 text-white">
              <li>✨ You'll get early access before everyone else</li>
              <li>🧠 Sample gentle daily emails to preview the experience</li>
              <li>💙 Updates on our ADHD-friendly development process</li>
              <li>🎯 Chance to influence features that matter to you</li>
            </ul>
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