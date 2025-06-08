import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          
          <p className="text-sm text-gray-600 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SMS Service Terms</h2>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-6">
              <p className="text-gray-800 mb-4">
                <strong>By opting in to receive SMS messages from goodberry, you agree to the following:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You consent to receive automated SMS messages related to calendar reminders, scheduling assistance, and service updates</li>
                <li>Message frequency may vary based on your calendar activity and preferences</li>
                <li>Standard message and data rates from your mobile carrier may apply</li>
                <li>You can opt out at any time by replying STOP to any message</li>
                <li>You can get help by replying HELP to any message</li>
                <li>Your consent is not required as a condition of purchase</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-4">
              goodberry is an AI-powered calendar assistant designed specifically for individuals with ADHD. Our service includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>SMS-based calendar reminders and notifications</li>
              <li>ADHD-friendly scheduling assistance</li>
              <li>Integration with your existing calendar systems</li>
              <li>Personalized timing and buffer recommendations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              By using our service, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Provide accurate contact information, including a valid phone number</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not share your account access with unauthorized users</li>
              <li>Notify us of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information, including your phone number and calendar data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-700 mb-4">
              While we strive to provide reliable service, SMS delivery may be affected by factors outside our control, including mobile carrier limitations and network availability. We cannot guarantee 100% message delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700">
              For questions about these Terms of Service, contact us at:
              <br />
              <strong>Email:</strong> dan@aportlandcareer.com
              <br />
              <strong>SMS Support:</strong> Reply HELP to any message
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 
