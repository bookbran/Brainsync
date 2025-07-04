const readline = require('readline');
const axios = require('axios');

// Configuration
const SERVER_URL = 'http://localhost:3000';
let TEST_PHONE = null;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function promptForUserChoice() {
  rl.question(colorize('\n👤 Continue as Dan (+155535491254) or start a new onboarding? (Type "dan" or "new"): ', 'bright'), async (input) => {
    const choice = input.trim().toLowerCase();
    if (choice === 'dan') {
      TEST_PHONE = '+155535491254';
      console.log(colorize(`\n📞 Continuing as Dan with phone: ${TEST_PHONE}`, 'yellow'));
      startInteractiveSession();
    } else if (choice === 'new') {
      TEST_PHONE = `+1555${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      console.log(colorize(`\n📞 Starting new onboarding with phone: ${TEST_PHONE}`, 'yellow'));
      startInteractiveSession();
    } else {
      console.log(colorize('Please type "dan" or "new".', 'yellow'));
      promptForUserChoice();
    }
  });
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
    
  } catch (error) {
    console.log(colorize(`\n❌ Error: ${error.message}`, 'red'));
    if (error.response?.data) {
      console.log(colorize(`Response: ${error.response.data}`, 'red'));
    }
  }
}

async function checkServerHealth() {
  try {
    const response = await axios.get(`${SERVER_URL}/health`);
    const health = response.data;
    
    console.log(colorize('🔍 Server Health Check:', 'bright'));
    console.log(colorize(`✅ Status: ${health.status}`, 'green'));
    console.log(colorize(`✅ Database: ${health.services?.database}`, 'green'));
    console.log(colorize(`✅ Anthropic API: ${health.environment?.hasAnthropicKey ? 'Connected' : 'Missing'}`, 
      health.environment?.hasAnthropicKey ? 'green' : 'red'));
    console.log(colorize(`✅ Supabase: ${health.environment?.hasSupabaseUrl ? 'Connected' : 'Missing'}`, 
      health.environment?.hasSupabaseUrl ? 'green' : 'red'));
    
    return health.environment?.hasAnthropicKey && health.environment?.hasSupabaseUrl;
    
  } catch (error) {
    console.log(colorize(`❌ Server not responding: ${error.message}`, 'red'));
    return false;
  }
}

async function startInteractiveSession() {
  console.log(colorize('\n🧠💙 Goodberry Fresh Onboarding Test', 'bright'));
  console.log(colorize('='.repeat(60), 'cyan'));
  console.log(colorize(`📞 Using fresh phone: ${TEST_PHONE}`, 'yellow'));
  console.log(colorize('🆕 This ensures clean onboarding from name collection', 'yellow'));
  
  // Check server health
  const isHealthy = await checkServerHealth();
  if (!isHealthy) {
    console.log(colorize('\n⚠️  Server or API keys may not be properly configured', 'yellow'));
    console.log(colorize('But let\'s try anyway! Sometimes it still works 🤞', 'yellow'));
  }
  
  console.log(colorize('\n🎯 Testing Improved Onboarding Flow:', 'cyan'));
  console.log(colorize('✨ Should start with name collection (not phase overview)', 'cyan'));
  console.log(colorize('📱 Phase announcements only when new phases begin', 'cyan'));
  console.log(colorize('💾 Gentle reminders about progress being saved', 'cyan'));
  
  console.log(colorize('\n💡 Try these onboarding test messages:', 'yellow'));
  console.log(colorize('   1. "whooboy.. is this gonna work?" (should ask for name)', 'yellow'));
  console.log(colorize('   2. "I\'m Alex" (should give name compliment)', 'yellow'));
  console.log(colorize('   3. "thanks! sure, tell me more" (should do readiness check)', 'yellow'));
  console.log(colorize('   4. "yes I\'m ready" (should do awesome explanation)', 'yellow'));
  console.log(colorize('   5. "ok let\'s do this" (should start Phase 1)', 'yellow'));
  
  console.log(colorize('\n📞 Commands:', 'green'));
  console.log(colorize('   • Type "quit" or "exit" to stop', 'green'));
  console.log(colorize('   • Type "help" for more commands', 'green'));
  console.log(colorize('   • Type "fresh" to start with new phone number', 'green'));
  console.log(colorize('\n' + '='.repeat(60), 'cyan'));
  
  askForMessage();
}

function askForMessage() {
  rl.question(colorize('\n💬 Your message: ', 'bright'), async (input) => {
    const message = input.trim();
    
    if (message.toLowerCase() === 'quit' || message.toLowerCase() === 'exit') {
      console.log(colorize('\n👋 Thanks for testing the onboarding flow!', 'cyan'));
      rl.close();
      return;
    }
    
    if (message.toLowerCase() === 'fresh') {
      console.log(colorize('\n🔄 Restarting with fresh phone number...', 'yellow'));
      rl.close();
      // Restart the script
      require('child_process').spawn(process.argv[0], [process.argv[1]], { stdio: 'inherit' });
      return;
    }
    
    if (message.toLowerCase() === 'help') {
      console.log(colorize('\n📋 Available commands:', 'yellow'));
      console.log(colorize('   • Any natural message - will be processed by AI', 'yellow'));
      console.log(colorize('   • "health" - check server status', 'yellow'));
      console.log(colorize('   • "fresh" - restart with new phone number', 'yellow'));
      console.log(colorize('   • "quit" or "exit" - end session', 'yellow'));
      console.log(colorize('   • "help" - show this help', 'yellow'));
      console.log(colorize('\n🧪 Expected Onboarding Sequence:', 'cyan'));
      console.log(colorize('   1️⃣ First message → Ask for name', 'cyan'));
      console.log(colorize('   2️⃣ Provide name → Name compliment', 'cyan'));
      console.log(colorize('   3️⃣ Respond → Readiness check', 'cyan'));
      console.log(colorize('   4️⃣ Say ready → Awesome explanation', 'cyan'));
      console.log(colorize('   5️⃣ Confirm → Start Phase 1 Brain Dump', 'cyan'));
      askForMessage();
      return;
    }
    
    if (message.toLowerCase() === 'health') {
      await checkServerHealth();
      askForMessage();
      return;
    }
    
    if (!message) {
      console.log(colorize('Please enter a message!', 'yellow'));
      askForMessage();
      return;
    }
    
    await sendMessage(message);
    askForMessage();
  });
}

// Start the interactive session
promptForUserChoice(); 