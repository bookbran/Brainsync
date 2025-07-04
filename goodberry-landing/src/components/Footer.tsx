import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          {/* Logo and tagline */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">
              <span className="text-3xl mr-2" style={{
                filter: 'hue-rotate(340deg) saturate(2.8) brightness(0.9) contrast(1.3)',
                textShadow: '0 0 5px rgba(190, 18, 60, 0.9), 0 0 10px rgba(219, 39, 119, 0.6), 0 0 15px rgba(136, 19, 55, 0.5)'
              }}>🫐</span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">goodberry</span>
            </h3>
            <p className="text-gray-300">
              Celebrating your choices, honoring your brain
            </p>
          </div>

          {/* Key values */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl mb-2">💙</div>
              <h4 className="font-semibold mb-2 text-white">Choice Empowerment</h4>
              <p className="text-sm text-gray-400">
                Every decision celebrated as conscious choice-making
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-semibold mb-2 text-white">ADHD-First Design</h4>
              <p className="text-sm text-gray-400">
                Built by ADHD brains, for ADHD brains
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold mb-2 text-white">Actually Works</h4>
              <p className="text-sm text-gray-400">
                Reliable technology that won't let you down
              </p>
            </div>
          </div>

          {/* Contact and links */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <p className="text-gray-400">
                A project by{' '}
                <a 
                  href="https://aportlandcareer.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  A Portland Career
                </a>
              </p>
              <p className="text-gray-400">
                Questions? Email{' '}
                <a 
                  href="mailto:dan@aportlandcareer.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  dan@aportlandcareer.com
                </a>
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <div className="mb-4 space-x-4">
                <Link 
                  to="/privacy" 
                  className="text-xs text-gray-400 hover:text-blue-300 transition-colors underline"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-600">|</span>
                <Link 
                  to="/terms" 
                  className="text-xs text-gray-400 hover:text-blue-300 transition-colors underline"
                >
                  Terms of Service
                </Link>
              </div>
              <p className="text-xs text-gray-500">
                © 2025 goodberry. Built with 💙 for the ADHD community.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Choice is power. Your brain is not broken. You deserve gentle guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
