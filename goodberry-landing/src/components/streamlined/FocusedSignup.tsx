import React, { useState, useEffect } from 'react';
import { addToWaitlist, addAppWishlist, supabase } from '../../supabaseClient';

const FocusedSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [feedbackInterest, setFeedbackInterest] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(0);
  
  // App wishlist states
  const [appWishlist, setAppWishlist] = useState('');
  const [submittingWishlist, setSubmittingWishlist] = useState(false);
  const [wishlistSubmitted, setWishlistSubmitted] = useState(false);
  const [showHPAnimation, setShowHPAnimation] = useState(false);

  // Admin states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [waitlistData, setWaitlistData] = useState<any[]>([]);

  // Fetch waitlist count on component mount
  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  // Trigger HP animation when submitted
  useEffect(() => {
    if (submitted) {
      setShowHPAnimation(true);
      // Hide animation after 3 seconds
      const timer = setTimeout(() => setShowHPAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const fetchWaitlistCount = async () => {
    try {
      console.log('Fetching waitlist count...');
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching count:', error);
        setWaitlistCount(0);
      } else {
        console.log('Waitlist count fetched:', count);
        setWaitlistCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching waitlist count:', error);
      setWaitlistCount(0);
    }
  };

  const fetchWaitlistData = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching waitlist data:', error);
      } else {
        setWaitlistData(data || []);
      }
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
    }
  };

  const handleCountClick = () => {
    setShowAdminModal(true);
  };

  const handleAdminLogin = (e: any) => {
    e.preventDefault();
    if (adminPassword === 'sunnylovescheese') {
      setIsAuthenticated(true);
      fetchWaitlistData();
    } else {
      alert('Incorrect password!');
    }
    setAdminPassword('');
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setIsAuthenticated(false);
    setAdminPassword('');
    setWaitlistData([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Check if phone number is required when smsConsent is true
      if (phone && !smsConsent) {
        setError('Please provide SMS consent to include your phone number, or remove your phone number to continue without SMS.');
        setIsSubmitting(false);
        return;
      }

      const result = await addToWaitlist(email, name, phone, smsConsent, feedbackInterest);
      
      if (result.success) {
        setSubmittedName(name); // Store name for personalized HP animation
        setSubmitted(true);
        // Don't clear email - we need it for the app wishlist
        setName('');
        setPhone('');
        setSmsConsent(false);
        setFeedbackInterest(1); // Reset to default
        fetchWaitlistCount(); // Update count after successful submission
        
        // Scroll to the welcome bubble after a brief delay for better UX
        setTimeout(() => {
          const bubble = document.getElementById('welcome-bubble');
          if (bubble) {
            bubble.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      } else {
        if (result.error?.includes('duplicate') || result.error?.includes('unique')) {
          setError('This email is already on our waitlist! Check your inbox for our previous confirmation.');
        } else {
          setError(result.error || 'Something went wrong. Please try again!');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWishlistSubmit = async (e: React.FormEvent) => {
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
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated +1 HP Celebration */}
        {showHPAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-8xl md:text-9xl font-black text-green-400 animate-pulse">
              +1 HP
            </div>
            <div className="absolute inset-0 bg-green-400 opacity-20 animate-ping"></div>
          </div>
        )}

        <div className="max-w-6xl mx-auto text-center text-white relative">
          {/* Success Header */}
          <div className="mb-12" id="welcome-bubble">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Welcome to Your Calendar Revolution!</span>
            </h2>
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{submittedName} has been redeemed!</span>
            </h3>
            <div className="text-3xl font-bold text-green-400 mb-2">+1 HP!</div>
            <p className="text-lg mb-6">
              Thank goodness for goodberry! 🎉
            </p>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              You're officially on the goodberry waitlist! We'll email you the moment 
              we're ready to help you celebrate every choice you make.
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">What happens next:</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">✨</div>
                <h4 className="font-semibold mb-2 text-blue-300">Early Access</h4>
                <p className="text-sm opacity-90">You'll get early access before everyone else</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">📧</div>
                <h4 className="font-semibold mb-2 text-blue-300">Sample Emails</h4>
                <p className="text-sm opacity-90">Gentle daily emails to preview the experience</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-semibold mb-2 text-blue-300">ADHD-Friendly Updates</h4>
                <p className="text-sm opacity-90">Updates on our development process</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2 text-blue-300">Influence Features</h4>
                <p className="text-sm opacity-90">Chance to shape what matters to you</p>
              </div>
            </div>
          </div>

          {/* Why the name goodberry? */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto mb-12">
            <h3 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">🎉 Why the name "goodberry"?</span>
            </h3>
            <div className="text-left space-y-4 text-lg leading-relaxed">
              <p>
                In Dungeons & Dragons, there's this magical spell called <strong>goodberry</strong>. 
                Here's the thing about it: when your character is completely unconscious—like, actually unconscious, 
                not just knocked out—a single goodberry can bring you back to consciousness with exactly +1 hit point (HP).
              </p>
              <p>
                Just +1 HP. That's it. Barely alive. But here's what's magical about it...
              </p>
              <p>
                <strong>You're not unconscious anymore.</strong> You can cast spells again. You can help your party. 
                You can think clearly. You can make choices. You can participate in your own adventure again.
              </p>
              <p className="text-blue-300 mb-8 leading-relaxed">
                That's exactly what we're building for people struggling with calendar overwhelm.
                Maybe you're in "unconscious party member" mode right now—feeling overwhelmed, 
                paralyzed by choices, unable to trust your own scheduling decisions.
              </p>
              <p>
                <strong>goodberry isn't trying to make you a productivity superhero overnight.</strong> 
                We're just trying to get you to +1 HP. To help you feel alive in your calendar again. 
                To celebrate that you made any choice at all, rather than staying frozen.
              </p>
              <p>
                Because once you're at +1 HP and feeling good about your choices? 
                That's when the real magic happens. That's when you start thriving again.
              </p>
            </div>
          </div>

          {/* App Wishlist Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-6xl mx-auto mb-12">
            <h4 className="text-2xl font-bold mb-4 text-white">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">💬 We Want to Hear From You</span>
            </h4>
            <p className="mb-6 text-lg">
              What apps do you use daily? What features would actually make your life easier? 
              What did we miss in our ideas above? Your thoughts help us build what you actually need, not what we think you need.
            </p>
            
            {!wishlistSubmitted ? (
              <form onSubmit={handleWishlistSubmit} className="space-y-4">
                <textarea
                  value={appWishlist}
                  onChange={(e) => setAppWishlist(e.target.value)}
                  placeholder="Tell us about your daily apps, your biggest ADHD challenges, or ideas you have about what would genuinely help you... (e.g., 'I use Notion but always forget to check it' or 'My biggest problem is remembering to eat' or 'I wish something helped me transition between tasks')"
                  className="w-full p-4 rounded-lg text-gray-800 h-40 resize-none"
                  rows={6}
                />
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={submittingWishlist || !appWishlist.trim()}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-300 disabled:opacity-50 transition-all transform hover:scale-105"
                  >
                    {submittingWishlist ? 'Submitting...' : 'Share My Thoughts'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWishlistSubmitted(true)}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                  >
                    Skip for Now
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">🙏</div>
                <h5 className="text-xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Thank You!</span>
                </h5>
                <p className="text-lg">
                  Your thoughts have been saved! We read every single response and they genuinely shape our roadmap.
                </p>
              </div>
            )}
          </div>

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
    <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
          Ready for <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">goodberry</span>?
        </h2>
        <p className="text-xl mb-12 text-white opacity-90">
          Join the{' '}
          <span 
            onClick={handleCountClick}
            className="text-4xl font-bold text-yellow-400 px-2 py-1 rounded hover:bg-white hover:bg-opacity-10 cursor-pointer hover:text-yellow-300 transition-colors duration-200"
            title="Click to view admin panel"
          >
            {waitlistCount}
          </span>{' '}
          on the waitlist and be among the first ADHD adults to experience <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">goodberry</span>.
        </p>

        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl p-6 mb-8 border-2 border-yellow-400 border-opacity-40">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🌟</span>
            <h3 className="text-2xl font-bold text-yellow-300">Pioneer Status Available</h3>
            <span className="text-3xl">🌟</span>
          </div>
          <p className="text-lg text-purple-100 mb-3">
            <strong className="text-yellow-300">First 100 members</strong> get early access + exclusive pioneer status!
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🚀</span>
              <span className="text-purple-200">Beta access before everyone else</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">💎</span>
              <span className="text-purple-200">Pioneer badge & special recognition</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🛠️</span>
              <span className="text-purple-200">Shape product development with direct feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🎯</span>
              <span className="text-purple-200">Lifetime access to exclusive updates</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            <p className="text-sm text-white opacity-80 text-center">
              📱 Phone numbers are optional for our waitlist, but you'll need one to use goodberry when it's ready since our app works through SMS.
            </p>
            
            {/* Feedback Interest Slider */}
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-4">
                📋 How interested are you in providing research feedback?
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white opacity-80">1 - Only contact me when ready</span>
                  <span className="text-xs text-white opacity-80">5 - Let's chat!</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feedbackInterest}
                  onChange={(e) => setFeedbackInterest(parseInt(e.target.value))}
                  className="w-full h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(feedbackInterest - 1) * 25}%, rgba(255,255,255,0.3) ${(feedbackInterest - 1) * 25}%, rgba(255,255,255,0.3) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-white opacity-70">
                  {[1, 2, 3, 4, 5].map(num => (
                    <span key={num} className={feedbackInterest === num ? 'font-bold text-green-300' : ''}>{num}</span>
                  ))}
                </div>
                <p className="text-sm text-white opacity-90 text-center">
                  Currently selected: <span className="font-semibold text-green-300">{feedbackInterest}</span> - 
                  {feedbackInterest === 1 && " Minimal contact, just let me know when it's ready"}
                  {feedbackInterest === 2 && " Occasional updates would be nice"}
                  {feedbackInterest === 3 && " I'm moderately interested in helping shape the product"}
                  {feedbackInterest === 4 && " I'd love to provide regular feedback"}
                  {feedbackInterest === 5 && " Count me in for everything! Let's chat!"}
                </p>
              </div>
            </div>
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
            disabled={isSubmitting || !email || !name.trim()}
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-black py-6 px-12 rounded-xl text-2xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-2xl border-4 border-yellow-300 hover:shadow-yellow-500/25"
          >
            {isSubmitting ? 'Joining...' : 'Join the Waitlist! 🚀'}
          </button>

          <p className="text-sm mt-4 opacity-75">
            💙 No calendar spam, just gentle planning support. Unsubscribe anytime.
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-semibold text-white">Built by people who get it</p>
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

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {!isAuthenticated ? (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Admin Access</h3>
                    <button 
                      onClick={closeAdminModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleAdminLogin}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Enter admin password:
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-800"
                        placeholder="Password"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={closeAdminModal}
                        className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Waitlist Entries ({waitlistData.length})
                    </h3>
                    <button 
                      onClick={closeAdminModal}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="overflow-auto max-h-[60vh]">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Email</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Phone</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">SMS Consent</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Feedback Interest</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Thoughts</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Source</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waitlistData.map((entry: any, index: number) => (
                          <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">{entry.email}</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">{entry.name || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">{entry.phone || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">
                              {entry.sms_consent ? 'Yes' : 'No'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">{entry.feedback_interest || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800 max-w-xs">
                              <div className="max-h-20 overflow-y-auto text-sm">
                                {entry.app_wishlist || '-'}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">{entry.source}</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-800">
                              {new Date(entry.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {waitlistData.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No entries found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FocusedSignup;