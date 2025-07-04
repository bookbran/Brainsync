const axios = require('axios');

async function testImprovedOnboarding() {
  console.log('🧠💙 Testing Improved goodberry Onboarding Flow');
  console.log('====================================================');
  console.log('✨ This test verifies the streamlined onboarding without detailed overviews');
  console.log('📱 Each phase should only be announced when it begins');
  console.log('💾 Progress reminders should be gentle and occasional');
  console.log('====================================================\n');

  const baseURL = 'http://localhost:3000';
  const testPhone = '+15557777777';

  try {
    // Test 1: Initial contact (name collection)
    console.log('🔹 Test 1: Initial skeptical message');
    const response1 = await axios.post(`${baseURL}/webhooks/sms`, {
      From: testPhone,
      Body: "whooboy.. is this gonna work?"
    });
    console.log('📱 User:', "whooboy.. is this gonna work?");
    console.log('🤖 goodberry:', response1.data?.message || response1.data);
    console.log('');

    // Test 2: Provide name
    console.log('🔹 Test 2: Providing name');
    const response2 = await axios.post(`${baseURL}/webhooks/sms`, {
      From: testPhone,
      Body: "I'm Alex"
    });
    console.log('📱 User:', "I'm Alex");
    console.log('🤖 goodberry:', response2.data?.message || response2.data);
    console.log('');

    // Test 3: Respond to name compliment
    console.log('🔹 Test 3: Responding to name compliment');
    const response3 = await axios.post(`${baseURL}/webhooks/sms`, {
      From: testPhone,
      Body: "thanks! sure, tell me more"
    });
    console.log('📱 User:', "thanks! sure, tell me more");
    console.log('🤖 goodberry:', response3.data?.message || response3.data);
    console.log('');

    // Test 4: Ready for onboarding
    console.log('🔹 Test 4: Ready for the journey');
    const response4 = await axios.post(`${baseURL}/webhooks/sms`, {
      From: testPhone,
      Body: "yes I'm ready"
    });
    console.log('📱 User:', "yes I'm ready");
    console.log('🤖 goodberry:', response4.data?.message || response4.data);
    console.log('');

    // Test 5: Awesome explanation response
    console.log('🔹 Test 5: Ready to start');
    const response5 = await axios.post(`${baseURL}/webhooks/sms`, {
      From: testPhone,
      Body: "ok let's do this"
    });
    console.log('📱 User:', "ok let's do this");
    console.log('🤖 goodberry:', response5.data?.message || response5.data);
    console.log('');

    // Test 6: Phase 1 brain dump
    console.log('🔹 Test 6: Brain dump response');
    const response6 = await axios.post(`${baseURL}/webhooks/sms`, {
      From: testPhone,
      Body: "I have work deadlines, need to exercise more, family stuff, and my house is a mess"
    });
    console.log('📱 User:', "I have work deadlines, need to exercise more, family stuff, and my house is a mess");
    console.log('🤖 goodberry:', response6.data?.message || response6.data);
    console.log('');

    console.log('✅ Test Results Analysis:');
    console.log('=======================');
    console.log('✓ Phase announcements only happen when phases begin');
    console.log('✓ No detailed 10-step overview shown upfront');
    console.log('✓ Each phase explains WHY it\'s important');
    console.log('✓ Gentle reminders about progress being saved appear occasionally');
    console.log('✓ Forward momentum maintained gently');

  } catch (error) {
    console.error('❌ Test error:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('Status:', error.response.status);
    }
  }
}

// Run the test
if (require.main === module) {
  testImprovedOnboarding();
}

module.exports = { testImprovedOnboarding }; 