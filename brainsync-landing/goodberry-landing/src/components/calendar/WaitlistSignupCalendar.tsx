import React, { useState } from 'react';
import { addToWaitlist } from '../../supabaseClient';

const WaitlistSignupCalendar = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await addToWaitlist(email, name, phone, smsConsent);
      
      if (result.success) {
        setSubmitted(true);
        setEmail('');
        setName('');
        setPhone('');
        setSmsConsent(false);
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
            🗡️ Calendar Quest Accepted! ⚔️
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-emerald-200 italic">
            *The Goodberry Calendar has been added to your spellbook*
          </h3>
          
          {/* D&D Lore Connection */}
          <div className="bg-black bg-opacity-40 rounded-2xl p-8 mb-8 max-w-4xl mx-auto backdrop-blur-sm border border-emerald-400 border-opacity-30">
            <div className="text-emerald-300 text-lg mb-4 font-serif italic">
              "Just as a druid's goodberry saves adventurers from death in the wilderness..."
            </div>
            <p className="text-xl mb-6 text-emerald-100 leading-relaxed">
              Our <span className="text-emerald-300 font-bold">goodberry calendar</span> will save your weeks from the chaos of 
              scattered priorities and overwhelming Sunday planning. No more Sunday Scaries - just magical Sunday → Friday flow.
            </p>
            <div className="text-emerald-200 text-lg">
              <strong>Your weekly survival spells are being enchanted...</strong>
            </div>
          </div>

          {/* Inventory Style What Happens Next */}
          <div className="bg-amber-900 bg-opacity-60 rounded-xl p-8 max-w-4xl mx-auto backdrop-blur-sm border-2 border-amber-500 border-opacity-50 mb-8">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl mr-4">📜</span>
              <h3 className="text-2xl font-bold text-amber-100 font-serif">Calendar Quest Log Updated</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-amber-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🌅</span>
                  <h4 className="font-bold text-amber-200">Sunday Planning Spells</h4>
                </div>
                <p className="text-amber-100 text-sm">Early access to magical 15-minute Sunday sessions that actually reduce anxiety instead of adding to it</p>
              </div>
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-amber-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">📧</span>
                  <h4 className="font-bold text-amber-200">Monday Morning Scrolls</h4>
                </div>
                <p className="text-amber-100 text-sm">Beautiful email snapshots of your week with weather magic, celebrations, and gentle suggestions</p>
              </div>
              
              {phone && smsConsent && (
                <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-emerald-600 border-opacity-50 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">📱</span>
                    <h4 className="font-bold text-emerald-200">Magical Text Nudges</h4>
                  </div>
                  <p className="text-emerald-100 text-sm">Since you've opted for text messages, we'll send gentle quest updates and calendar nudges when your goodberry magic is ready!</p>
                </div>
              )}
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-purple-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🎯</span>
                  <h4 className="font-bold text-purple-200">Shape the Calendar Magic</h4>
                </div>
                <p className="text-purple-100 text-sm">Help us craft calendar spells that actually work for ADHD brains - your feedback shapes the magic</p>
              </div>
              
              <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-blue-600 border-opacity-30">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🧠</span>
                  <h4 className="font-bold text-blue-200">ADHD Calendar Wisdom</h4>
                </div>
                <p className="text-blue-100 text-sm">Updates from fellow ADHD adventurers who are transforming their relationship with time</p>
              </div>
            </div>
          </div>

          {/* Special Calendar Features */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 border-2 border-indigo-400 border-opacity-40 backdrop-blur-sm mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-4">📅</span>
              <h3 className="text-2xl font-bold text-indigo-100 font-serif">Your Calendar Magic Includes</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🌊</div>
                <h4 className="font-semibold text-indigo-200 mb-2">Flexible Flow Spells</h4>
                <p className="text-indigo-300 text-sm">Plans change? That's a conscious choice we celebrate, not a failure to fix</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="font-semibold text-indigo-200 mb-2">Mental Health Protection</h4>
                <p className="text-indigo-300 text-sm">Sacred buffer time that's protected from the chaos of back-to-back meetings</p>
              </div>
            </div>
          </div>

          {/* ADHD Coaching CTA */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-2xl p-8 border-2 border-purple-400 border-opacity-40 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-4">🏰</span>
              <h3 className="text-2xl font-bold text-purple-100 font-serif">Need Calendar Coaching Before Your Quest?</h3>
            </div>
            <p className="text-purple-200 text-lg mb-6 leading-relaxed">
              While you wait for your magical goodberry calendar, join fellow ADHD adventurers at 
              <span className="text-purple-300 font-bold"> A Portland Career</span> for expert ADHD coaching and career support.
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
          Ready to Beat the Sunday Scaries?
        </h2>
        <p className="text-xl mb-12 text-white opacity-90">
          Join the waitlist and be among the first ADHD adults to experience 
          calendar management that actually celebrates your brain.
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
            <input
              type="tel"
              placeholder="Phone number for SMS reminders (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border-2 border-white border-opacity-30 rounded-lg focus:border-white focus:outline-none transition-colors text-lg bg-white bg-opacity-90 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* SMS Consent Section */}
          {phone && (
            <div className="mb-6 bg-white bg-opacity-10 rounded-lg p-4 text-left">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 bg-white rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="text-sm text-white">
                  <p className="font-semibold mb-2">📱 SMS Consent & Terms</p>
                  <p className="mb-2">
                    By checking this box, I consent to receive automated text messages from goodberry, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs opacity-90 mb-2">
                    <li>Calendar reminders and gentle nudges</li>
                    <li>ADHD-friendly scheduling assistance</li>
                    <li>Weekly planning support messages</li>
                    <li>Occasional product updates</li>
                  </ul>
                  <p className="text-xs opacity-75">
                    Message frequency varies. Standard message & data rates may apply. 
                    Reply STOP to opt out anytime. Reply HELP for help. 
                    <br />
                    <a href="/privacy" className="underline hover:text-blue-200" target="_blank">
                      View Privacy Policy
                    </a> | 
                    <a href="/terms" className="underline hover:text-blue-200 ml-1" target="_blank">
                      View Terms
                    </a>
                  </p>
                </div>
              </label>
            </div>
          )}

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
            {isSubmitting ? 'Joining...' : 'Start My Sunday Revolution'}
          </button>

          <p className="text-sm mt-4 text-white opacity-75">
            💙 No calendar spam, just gentle planning support. Unsubscribe anytime.
          </p>
        </form>

        {/* Calendar-specific social proof */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">📅</div>
            <p className="font-semibold text-white">Works with your calendar</p>
            <p className="text-sm text-white opacity-75">Google, Outlook, Apple - we sync with them all</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🌊</div>
            <p className="font-semibold text-white">Celebrates flexibility</p>
            <p className="text-sm text-white opacity-75">Plans change? That's a conscious choice we honor</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🧠</div>
            <p className="font-semibold text-white">Built for ADHD brains</p>
            <p className="text-sm text-white opacity-75">Sunday planning + weekly follow-through support</p>
          </div>
        </div>

        {/* What Early Users Get */}
        <div className="mt-16 bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6">
            Early Access Includes:
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-white mb-2">🌅 Sunday Planning Sessions</h4>
              <p className="text-sm text-white opacity-75">
                Guided 15-20 minute sessions that actually reduce Sunday anxiety instead of adding to it.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">📱 Gentle Weekly Nudges</h4>
              <p className="text-sm text-white opacity-75">
                Text messages with 1/2/3 reply options that respect your energy and choices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">📧 Monday Morning Snapshots</h4>
              <p className="text-sm text-white opacity-75">
                Beautiful email summaries of your week with weather, celebrations, and gentle suggestions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">🎯 Choice Celebration</h4>
              <p className="text-sm text-white opacity-75">
                Every calendar decision honored - from perfect adherence to creative interpretations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSignupCalendar; 
