import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-adhd-dark text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          {/* Logo and tagline */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">
              🧠⚡ BrainSync Pro
            </h3>
            <p className="text-gray-300">
              Celebrating your choices, honoring your brain
            </p>
          </div>

          {/* Key values */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl mb-2">💙</div>
              <h4 className="font-semibold mb-2">Choice Empowerment</h4>
              <p className="text-sm text-gray-400">
                Every decision celebrated as conscious choice-making
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🧠</div>
              <h4 className="font-semibold mb-2">ADHD-First Design</h4>
              <p className="text-sm text-gray-400">
                Built by ADHD brains, for ADHD brains
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold mb-2">Actually Works</h4>
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
                  className="text-adhd-blue hover:text-adhd-purple transition-colors"
                >
                  A Portland Career
                </a>
              </p>
              <p className="text-gray-400">
                Questions? Email{' '}
                <a 
                  href="mailto:dan@aportlandcareer.com" 
                  className="text-adhd-blue hover:text-adhd-purple transition-colors"
                >
                  dan@aportlandcareer.com
                </a>
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2025 BrainSync Pro. Built with 💙 for the ADHD community.
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