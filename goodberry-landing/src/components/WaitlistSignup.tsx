import React, { useState, useEffect } from 'react';
import { addToWaitlist, addAppWishlist, supabase } from '../supabaseClient';

const WaitlistSignup = () => {
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
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  
  // App wishlist states
  const [appWishlist, setAppWishlist] = useState('');
  const [submittingWishlist, setSubmittingWishlist] = useState(false);
  const [wishlistSubmitted, setWishlistSubmitted] = useState(false);
  const [showHPAnimation, setShowHPAnimation] = useState(false);

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
        setWaitlistCount(0); // Set to 0 if there's an error
      } else {
        console.log('Waitlist count fetched:', count);
        setWaitlistCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching waitlist count:', error);
      setWaitlistCount(0); // Set to 0 if there's an error
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

  const handleSubmit = async (e: any) => {
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

  const labsApps = [
    { name: 'Apple Calendar', icon: '📅', category: 'Calendar' },
    { name: 'Google Calendar', icon: '🗓️', category: 'Calendar' },
    { name: 'Outlook', icon: '📧', category: 'Email/Calendar' },
    { name: 'Notion', icon: '📝', category: 'Productivity' },
    { name: 'Todoist', icon: '✅', category: 'Tasks' },
    { name: 'Apple Notes', icon: '📋', category: 'Notes' },
    { name: 'Obsidian', icon: '🧠', category: 'Knowledge' },
    { name: 'Spotify', icon: '🎵', category: 'Music' },
    { name: 'Apple Music', icon: '🎶', category: 'Music' },
    { name: 'Focus', icon: '🎯', category: 'Focus' },
    { name: 'Forest', icon: '🌲', category: 'Focus' },
    { name: 'Headspace', icon: '🧘', category: 'Mindfulness' },
    { name: 'Daylio', icon: '😊', category: 'Mood' },
    { name: 'Sleep Cycle', icon: '😴', category: 'Sleep' },
    { name: 'Calm', icon: '🌊', category: 'Wellness' },
    { name: 'MyFitnessPal', icon: '🏃', category: 'Health' },
    { name: 'Duolingo', icon: '🦜', category: 'Learning' },
    { name: 'Kindle', icon: '📚', category: 'Reading' }
  ];

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
              Welcome to Your Calendar Revolution!
            </h2>
            <h3 className="text-2xl font-bold mb-4">
              {submittedName} has been redeemed!
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
            <h3 className="text-2xl font-bold mb-6">What happens next:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">✨</div>
                <h4 className="font-semibold mb-2">Early Access</h4>
                <p className="text-sm opacity-90">You'll get early access before everyone else</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">📧</div>
                <h4 className="font-semibold mb-2">Sample Emails</h4>
                <p className="text-sm opacity-90">Gentle daily emails to preview the experience</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-semibold mb-2">ADHD-Friendly Updates</h4>
                <p className="text-sm opacity-90">Updates on our development process</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Influence Features</h4>
                <p className="text-sm opacity-90">Chance to shape what matters to you</p>
              </div>
            </div>
          </div>

          {/* Why the name goodberry? */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto mb-12">
            <h3 className="text-3xl font-bold mb-6">🎉 Why the name "goodberry"?</h3>
            <div className="text-left space-y-4 text-lg leading-relaxed">
              <p>
                In Dungeons & Dragons, there's this magical spell called <strong>goodberry</strong>. 
                Here's the thing about it: when your character is completely dead—like, actually dead, 
                not just knocked out—a single goodberry can bring you back to life with exactly +1 hit point (HP).
              </p>
              <p>
                Just +1 HP. That's it. Barely alive. But here's what's magical about it...
              </p>
              <p>
                <strong>You're not unconscious anymore.</strong> You can cast spells again. You can help your party. 
                You can think clearly. You can make choices. You can participate in your own adventure again.
              </p>
              <p className="text-blue-300">
                That's exactly what we're building for ADHD brains struggling with calendar overwhelm.
                Maybe you're in "unconscious party member" mode right now—feeling overwhelmed, paralyzed by choices,
                unable to trust your own scheduling decisions.
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

          {/* Complete Future Roadmap */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-6xl mx-auto mb-12">
            <h3 className="text-3xl font-bold mb-6">💭 Ideas We're Exploring Together</h3>
            <p className="text-lg opacity-90 mb-8 text-center">
              You're joining us at the very beginning, which means <strong>you get to help shape what goodberry becomes</strong>. 
              Our roadmap isn't set in stone—these are ideas we're excited about, and we want to hear what resonates with you 
              and what we might be missing.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Core Calendar Features */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl mb-3">📅</div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Where We're Starting</h4>
                <ul className="text-sm space-y-2 text-left">
                  <li>• ADHD-friendly conversation building</li>
                  <li>• Buffer time preservation</li>
                  <li>• Energy pattern optimization</li>
                  <li>• Choice celebration framework</li>
                  <li>• Google Calendar integration</li>
                </ul>
              </div>

              {/* Health & Wellness */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl mb-3">💊</div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Health & Medication Ideas</h4>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Medication timing optimization</li>
                  <li>• Smart refill reminders</li>
                  <li>• Side effect tracking</li>
                  <li>• Doctor appointment prep</li>
                  <li>• Health pattern insights</li>
                </ul>
                <p className="text-xs mt-3 opacity-80 italic">What would be most helpful for you?</p>
              </div>

              {/* Family & Social */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Family & Social Possibilities</h4>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Partner calendar sync</li>
                  <li>• Children's schedule coordination</li>
                  <li>• Family meal planning</li>
                  <li>• Shared responsibility tracking</li>
                  <li>• Social battery management</li>
                </ul>
                <p className="text-xs mt-3 opacity-80 italic">How does your family coordinate now?</p>
              </div>

              {/* Professional Support */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl mb-3">💼</div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Workplace & Career Ideas</h4>
                <ul className="text-sm space-y-2 text-left">
                  <li>• ADHD coaching integration</li>
                  <li>• Career planning support</li>
                  <li>• Workplace accommodation tools</li>
                  <li>• Success timeline tracking</li>
                  <li>• Confidence building engine</li>
                </ul>
                <p className="text-xs mt-3 opacity-80 italic">What's your biggest work challenge?</p>
              </div>

              {/* Environmental Intelligence */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl mb-3">🌤️</div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Environmental Support Ideas</h4>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Weather-aware planning</li>
                  <li>• Seasonal adjustment support</li>
                  <li>• Light therapy reminders</li>
                  <li>• Air quality notifications</li>
                  <li>• Environment optimization tips</li>
                </ul>
                <p className="text-xs mt-3 opacity-80 italic">Do external factors affect your planning?</p>
              </div>

              {/* Crisis Prevention */}
              <div className="bg-white bg-opacity-20 rounded-xl p-6">
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Support & Safety Ideas</h4>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Advanced brain trap detection</li>
                  <li>• Mental health gap monitoring</li>
                  <li>• Emergency support activation</li>
                  <li>• Therapist integration</li>
                  <li>• Preventive intervention</li>
                </ul>
                <p className="text-xs mt-3 opacity-80 italic">What early warning signs matter to you?</p>
              </div>
            </div>

            {/* ✅ CORRECT STYLING: This section now matches goodberry branding */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl p-6 mb-6">
              <h4 className="text-xl font-bold mb-3 text-sky-300">💡 Bigger Picture Possibilities</h4>
              <p className="text-sm mb-4 opacity-90">
                These are some directions we're thinking about, but we want to hear what <em>you</em> think would make the biggest difference:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <h5 className="font-semibold mb-2">🏢 Workplace Integration</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Corporate ADHD support programs</li>
                    <li>• Team calendar coordination</li>
                    <li>• Accommodation documentation</li>
                    <li>• Productivity insights for managers</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">🎓 Educational Partnerships</h5>
                  <ul className="text-sm space-y-1">
                    <li>• College disability services</li>
                    <li>• Student accommodation tools</li>
                    <li>• Study schedule optimization</li>
                    <li>• Academic success tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold mb-2 text-white">📱 <strong>Important Note About Phone Numbers</strong></p>
              <p className="text-sm text-white max-w-2xl mx-auto">
                goodberry works through SMS for the most ADHD-friendly experience possible. 
                While you don't need a phone number to join our waitlist, you'll need one to use the app when it launches. 
                We'll ask for your number when you're ready to start your goodberry journey!
              </p>
            </div>
          </div>

          {/* aportlandcareer.com mention */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto mb-12">
            <p className="text-lg mb-4">
              🌲 <strong>Want more ADHD-friendly career insights?</strong>
            </p>
            <p className="mb-4">
              Check out <a href="https://aportlandcareer.com" target="_blank" rel="noopener noreferrer" 
              className="text-yellow-300 hover:text-yellow-200 underline font-semibold">aportlandcareer.com</a> 
              {" "}for job search strategies that actually work for ADHD brains.
            </p>
          </div>

          {/* Full Labs Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-6xl mx-auto mb-12">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-blue-400 text-blue-900 px-6 py-3 rounded-full text-lg font-medium mb-6">
                <span>🧪 Labs: Future Integrations</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Calendar First, Everything Else Later
              </h3>
              <p className="text-lg opacity-90 max-w-4xl mx-auto mb-8">
                Here's the thing about ADHD brains: we get overwhelmed fast when there's too much happening at once. 
                So we're laser-focused on getting our calendar tool absolutely perfect first. But we're dreaming big about what's next...
              </p>
            </div>

            {/* Philosophy Box */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 text-blue-900 rounded-xl p-6 mb-8">
              <h4 className="text-xl font-bold mb-3">Our Philosophy: One Thing, Done Right</h4>
              <p className="text-left leading-relaxed">
                We're not trying to be another "productivity suite" that does everything poorly. 
                We're building the most ADHD-friendly calendar experience possible first. 
                Once that's perfect, we'll carefully add integrations that actually make sense for how ADHD brains work.
              </p>
            </div>

            {/* Apps Grid */}
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-6">Apps We're Considering for Future Integration:</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                {labsApps.map((app, index) => (
                  <div 
                    key={index}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-3 text-center transition-all duration-300 border border-white border-opacity-20 hover:border-opacity-40 cursor-pointer group"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{app.icon}</div>
                    <h5 className="font-semibold text-xs mb-1">{app.name}</h5>
                    <p className="text-xs opacity-75">{app.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* App Wishlist Form */}
            <div className="bg-white bg-opacity-20 rounded-xl p-6">
              <h4 className="text-2xl font-bold mb-4 text-white">💬 We Want to Hear From You</h4>
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
                  <h5 className="text-xl font-bold mb-2">Thank You!</h5>
                  <p className="text-lg">
                    Your thoughts have been saved! We read every single response and they genuinely shape our roadmap.
                  </p>
                </div>
              )}
            </div>
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
          Ready to Beat the Sunday Scaries?
        </h2>
        <p className="text-xl mb-12 text-white opacity-90">
          Join the{' '}
          <span 
            onClick={handleCountClick}
            className="text-4xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-white hover:bg-opacity-10"
            title="Click to view admin panel"
          >
            {waitlistCount}
          </span>{' '}
          on the waitlist and be among the first ADHD adults to experience 
          calendar management that actually celebrates your brain.
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

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
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

export default WaitlistSignup; 
