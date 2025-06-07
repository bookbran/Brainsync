import React, { useState } from 'react';

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
      // For now, just simulate success
      // In production, this would integrate with the backend
              setTimeout(() => {
          setSubmitted(true);
          setEmail('');
          setName('');
          setPhone('');
          setSmsConsent(false);
          setIsSubmitting(false);
        }, 1000);
    } catch (err) {
      setError('Something went wrong. Please try again!');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Welcome to Sunday → Friday Freedom!
          </h2>
          <p className="text-xl mb-8 text-white opacity-90">
            You're officially on the BrainSync Pro calendar waitlist! We'll email you the moment 
            we're ready to transform your relationship with time management.
          </p>
          <div className="bg-white bg-opacity-20 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-lg text-white font-semibold">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-left mt-4 space-y-2 text-white">
              <li>🌅 Early access to Sunday planning sessions</li>
              <li>📱 Sample gentle nudge texts to preview the experience</li>
              <li>📧 Monday morning plan snapshots to see the magic</li>
              <li>🎯 Help us build features that actually work for ADHD brains</li>
              <li>💙 Updates from fellow ADHDers who are transforming their calendars</li>
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
                    By checking this box, I consent to receive automated text messages from BrainSync Pro, including:
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