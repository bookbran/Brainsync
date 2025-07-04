import React, { useState } from 'react';
import { addToWaitlist, addAppWishlist } from '../supabaseClient';

const WaitlistSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // App wishlist states
  const [showAppWishlist, setShowAppWishlist] = useState(false);
  const [appWishlist, setAppWishlist] = useState('');
  const [submittingWishlist, setSubmittingWishlist] = useState(false);
  const [wishlistSubmitted, setWishlistSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await addToWaitlist(email, name, phone);
      
      if (result.success) {
        setSubmitted(true);
        // Don't clear email - we need it for the app wishlist
        setName('');
        setPhone('');
      } else {
        console.error('Signup failed:', result.error);
        setError(result.error || 'Something went wrong. Please try again!');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWishlistSubmit = async (e: any) => {
    e.preventDefault();
    setSubmittingWishlist(true);

    try {
      const result = await addAppWishlist(email, appWishlist);
      
      if (result.success) {
        setWishlistSubmitted(true);
        setAppWishlist('');
      } else {
        console.error('Wishlist failed:', result.error);
        setError('Failed to submit wishlist. Please try again.');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      setError('Failed to submit wishlist. Please try again.');
    } finally {
      setSubmittingWishlist(false);
    }
  };

  if (submitted) {
    return (
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-adhd-blue to-adhd-purple">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Welcome to the Choice Revolution!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            You're officially on the BrainSync Pro waitlist! We'll email you the moment 
            we're ready to start celebrating your choices.
          </p>
          <div className="bg-white bg-opacity-20 rounded-xl p-6 max-w-2xl mx-auto mb-8">
            <p className="text-lg">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-left mt-4 space-y-2">
              <li>✨ You'll get early access before everyone else</li>
              <li>🧠 Sample gentle daily emails to preview the experience</li>
              <li>💙 Updates on our ADHD-friendly development process</li>
              <li>🎯 Chance to influence features that matter to you</li>
            </ul>
          </div>

          {/* App Wishlist Section */}
          {!showAppWishlist && !wishlistSubmitted && (
            <div className="bg-white bg-opacity-10 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">💡 Help Shape Our Integrations!</h3>
              <p className="mb-4">
                We're interested in your app integration ideas too! What apps do you use daily that you'd love to see integrated?
              </p>
              <button
                onClick={() => setShowAppWishlist(true)}
                className="bg-white text-adhd-blue font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all"
              >
                Share Your App Wishlist
              </button>
            </div>
          )}

          {showAppWishlist && !wishlistSubmitted && (
            <div className="bg-white bg-opacity-10 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🚀 Your App Integration Wishlist</h3>
              <form onSubmit={handleWishlistSubmit}>
                <textarea
                  value={appWishlist}
                  onChange={(e) => setAppWishlist(e.target.value)}
                  placeholder="Tell us about the apps you use daily... (e.g., Notion, Todoist, Apple Notes, Spotify, etc.)"
                  className="w-full p-4 rounded-lg text-adhd-dark mb-4 h-32"
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submittingWishlist || !appWishlist.trim()}
                    className="bg-white text-adhd-blue font-bold py-3 px-6 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
                  >
                    {submittingWishlist ? 'Submitting...' : 'Submit Wishlist'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppWishlist(false)}
                    className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-adhd-blue transition-all"
                  >
                    Skip for Now
                  </button>
                </div>
              </form>
            </div>
          )}

          {wishlistSubmitted && (
            <div className="bg-white bg-opacity-10 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">🙏 Thank You!</h3>
              <p>
                Your app integration ideas have been saved! We'll consider these as we build our roadmap.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-200 bg-red-500 bg-opacity-20 p-3 rounded-lg max-w-2xl mx-auto">
              {error}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-adhd-blue to-adhd-purple">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Ready to Beat the Sunday Scaries?
        </h2>
        <p className="text-xl mb-12 opacity-90">
          Join the waitlist and be among the first ADHD adults to experience calendar management that actually celebrates your brain.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Dan Hahn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field text-adhd-dark"
            />
            <input
              type="email"
              placeholder="daniel.i.hahn@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field text-adhd-dark"
            />
            <input
              type="tel"
              placeholder="5034709544"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field text-adhd-dark"
            />
          </div>

          {/* SMS Consent */}
          <div className="mb-6 text-left bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-start space-x-3 mb-3">
              <input type="checkbox" required className="mt-1" />
              <div className="text-sm">
                <strong>📱 SMS Consent & Terms</strong>
                <p className="mt-2 text-xs opacity-90">
                  By checking this box, I consent to receive automated text messages from goodberry, including:
                </p>
                <ul className="mt-2 text-xs space-y-1 opacity-90">
                  <li>• Calendar reminders and gentle nudges</li>
                  <li>• ADHD-friendly scheduling assistance</li>
                  <li>• Weekly planning support messages</li>
                  <li>• Occasional product updates</li>
                </ul>
                <p className="mt-3 text-xs opacity-75">
                  Message frequency varies. Standard message & data rates may apply. 
                  Reply STOP to opt out anytime. Reply HELP for help.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-200 bg-red-500 bg-opacity-20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full bg-white text-adhd-blue font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isSubmitting ? 'Joining...' : 'Start My Sunday Revolution'}
          </button>

          <p className="text-sm mt-4 opacity-75">
            💙 No calendar spam, just gentle planning support. Unsubscribe anytime.
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-semibold">Built by ADHD brains</p>
            <p className="text-sm opacity-75">We understand because we live it</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✨</div>
            <p className="font-semibold">No new apps needed</p>
            <p className="text-sm opacity-75">Works with what you already use</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💙</div>
            <p className="font-semibold">Zero productivity guilt</p>
            <p className="text-sm opacity-75">Choice celebration, not optimization</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSignup; 