const axios = require('axios');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const TEST_PHONE = '+155535491254'; // Dan's phone number

// Colors for better output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

async function sendMessage(message) {
  try {
    console.log(colorize(`\n📱 You: ${message}`, 'cyan'));
    console.log(colorize('⏳ Thinking...', 'yellow'));
    
    const response = await axios.post(`${SERVER_URL}/webhooks/sms`, 
      `From=${encodeURIComponent(TEST_PHONE)}&Body=${encodeURIComponent(message)}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 30000
      }
    );

    // Parse TwiML response
    let goodberryResponse = response.data;
    const messageMatch = goodberryResponse.match(/<Message>(.*?)<\/Message>/s);
    if (messageMatch) {
      goodberryResponse = messageMatch[1].trim();
    }

    console.log(colorize(`\n🤖 Goodberry: ${goodberryResponse}`, 'magenta'));
    console.log(colorize('\n' + '='.repeat(60), 'green'));
    
    return goodberryResponse;
    
  } catch (error) {
    console.log(colorize(`\n❌ Error: ${error.message}`, 'red'));
    if (error.response?.data) {
      console.log(colorize(`Response: ${error.response.data}`, 'red'));
    }
    return null;
  }
}

async function testReturnExperience() {
  console.log(colorize('\n🧠💙 Testing Enhanced Return Experience', 'bright'));
  console.log(colorize('='.repeat(60), 'cyan'));
  console.log(colorize(`📞 Using phone: ${TEST_PHONE}`, 'yellow'));
  console.log(colorize('🎯 Testing return messages after onboarding completion', 'cyan'));
  
  console.log(colorize('\n📋 Test Sequence:', 'yellow'));
  console.log(colorize('   1. "hi goodberry, where were we again?" (should give warm welcome + OAuth link)', 'yellow'));
  console.log(colorize('   2. "yes" (should give OAuth link again)', 'yellow'));
  console.log(colorize('   3. "hello" (should give warm welcome + OAuth link)', 'yellow'));
  
  console.log(colorize('\n' + '='.repeat(60), 'cyan'));
  
  // Test 1: Return message
  console.log(colorize('\n🧪 Test 1: Return message', 'bright'));
  await sendMessage("hi goodberry, where were we again?");
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Simple "yes" response
  console.log(colorize('\n🧪 Test 2: Simple "yes" response', 'bright'));
  await sendMessage("yes");
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Another return message
  console.log(colorize('\n🧪 Test 3: Another return message', 'bright'));
  await sendMessage("hello");
  
  console.log(colorize('\n✅ Return experience test complete!', 'green'));
  console.log(colorize('Check that each response includes:', 'yellow'));
  console.log(colorize('   • Warm, ADHD-friendly welcome message', 'yellow'));
  console.log(colorize('   • Actual OAuth URL (not placeholder)', 'yellow'));
  console.log(colorize('   • Clear explanation of what happens next', 'yellow'));
  console.log(colorize('   • Encouraging, non-pressure tone', 'yellow'));
}

// Run the test
testReturnExperience().catch(console.error); 