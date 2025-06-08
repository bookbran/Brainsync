import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          
          <p className="text-sm text-gray-600 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SMS Messaging Consent</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <p className="text-gray-800 mb-4">
                <strong>By providing your phone number and opting in to SMS messages, you explicitly consent to receive:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Calendar reminders and scheduling notifications</li>
                <li>ADHD-friendly task and appointment alerts</li>
                <li>Onboarding messages to help set up your goodberry experience</li>
                <li>Occasional product updates and feature announcements</li>
              </ul>
              <p className="text-gray-800 mt-4">
                <strong>Message Frequency:</strong> You may receive up to 10 messages per week, depending on your calendar activity and preferences.
              </p>
              <p className="text-gray-800 mt-2">
                <strong>Opt-Out:</strong> You can opt out at any time by replying STOP to any message. Standard message and data rates may apply.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Contact Information:</strong> Phone number, email address, and name</li>
              <li><strong>Calendar Data:</strong> Calendar events, appointments, and scheduling preferences (with your explicit consent)</li>
              <li><strong>Communication Preferences:</strong> Your preferred times for notifications and reminder settings</li>
              <li><strong>Usage Data:</strong> How you interact with our SMS service and calendar features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Send you calendar reminders and notifications via SMS (only with your consent)</li>
              <li>Provide ADHD-friendly scheduling assistance</li>
              <li>Improve our service based on your usage patterns</li>
              <li>Communicate with you about your account and service updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of SMS communications at any time by replying STOP</li>
              <li>Request a copy of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              For questions about this Privacy Policy or to exercise your rights, contact us at:
              <br />
              <strong>Email:</strong> dan@aportlandcareer.com
              <br />
              <strong>Privacy Officer:</strong> goodberry Team
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 
