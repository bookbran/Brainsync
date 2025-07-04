import React, { useState, useEffect } from 'react';

const VisualTestimonials: React.FC = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [waitlistData, setWaitlistData] = useState<any[]>([]);

  const fetchWaitlistData = async () => {
    try {
      const response = await fetch('/api/admin/waitlist');
      const data = await response.json();
      
      if (response.ok) {
        setWaitlistData(data || []);
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

  const testimonials = [
    {
      id: 1,
      quote: "OMG, it's so easy to use and it works",
      name: "Sarah M.",
      role: "Coach & Mom",
      avatar: "👩‍💼",
      avatarBgColor: "rgb(59, 130, 246)", // Month 1 blue
      bgColor: "from-blue-50 to-blue-100",
      accentColor: "blue",
      detail: "Not against me for once"
    },
    {
      id: 2,
      quote: "Stopped feeling guilty about my calendar",
      name: "Mike",
      role: "Software Developer",
      avatar: "👨‍💻",
      avatarBgColor: "rgb(132, 204, 22)", // Month 2 lime
      bgColor: "from-blue-50 to-blue-100",
      accentColor: "blue"
    },
    {
      id: 3,
      quote: "Actually follow through on my plans now",
      name: "Alex",
      role: "Parent & Entrepreneur",
      avatar: "👩‍🚀",
      avatarBgColor: "rgb(168, 85, 247)", // Month 3 cranberry
      bgColor: "from-blue-50 to-blue-100",
      accentColor: "blue"
    }
  ];

  const metrics = [
    {
      icon: "📊",
      value: "1,247",
      label: "people on waitlist",
      clickable: true
    },
    {
      icon: "⭐",
      value: "4.9/5",
      label: "ADHD satisfaction rating"
    },
    {
      icon: "📈",
      value: "87%",
      label: "follow-through improvement"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            People Love <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">goodberry</span>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group hover:scale-105 transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${testimonial.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/50`}>
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4 mx-auto text-white"
                    style={{ backgroundColor: testimonial.avatarBgColor }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="text-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <p className="text-gray-900 font-semibold text-lg leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-center mt-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Bar */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <div 
                  className={`text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-200 ${
                    metric.clickable ? 'cursor-pointer hover:text-blue-600' : ''
                  }`}
                  onClick={metric.clickable ? handleCountClick : undefined}
                  title={metric.clickable ? "Click to view admin panel" : undefined}
                >
                  {metric.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Join Them on the Waitlist
          </button>
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

export default VisualTestimonials; 