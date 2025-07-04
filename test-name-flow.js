const http = require('http');

// Test the name-aware greeting flow
async function testNameFlow() {
  console.log('🧪 Testing Name-Aware Greeting Flow...\n');
  
  // Use a completely fresh phone number
  const freshPhone = `+1999${Date.now().toString().slice(-7)}`;
  
  console.log(`📱 Using fresh phone number: ${freshPhone}`);
  console.log('This should trigger the name collection flow!\n');
  
  // Test 1: First message from new user (should ask for name)
  console.log('🔸 Test 1: First message from brand new user');
  await sendMessage(freshPhone, 'Hello, I need help with my schedule');
  
  await wait(2000);
  
  // Test 2: User provides their name
  console.log('\n🔸 Test 2: User provides their name');
  await sendMessage(freshPhone, 'My name is Alex');
  
  await wait(2000);
  
  // Test 3: User confirms readiness to discuss awesomeness
  console.log('\n🔸 Test 3: User confirms readiness');
  await sendMessage(freshPhone, 'Yes, sounds good!');
  
  console.log('\n🎉 Name flow test complete!');
  console.log('📝 Check if the responses show:');
  console.log('   1. Asked for name warmly');
  console.log('   2. Complimented name with ADHD moment');
  console.log('   3. Moved to explaining awesomeness');
}

async function sendMessage(phone, message) {
  const postData = `Body=${encodeURIComponent(message)}&From=${encodeURIComponent(phone)}`;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/webhooks/sms',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    console.log(`💬 Sending: "${message}"`);
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Extract the message content from TwiML
        const messageMatch = data.match(/<Message[^>]*>(.*?)<\/Message>/s);
        if (messageMatch) {
          const aiMessage = messageMatch[1].trim();
          console.log('🤖 Goodberry:', aiMessage);
        } else {
          console.log('❌ Could not extract message from response');
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

testNameFlow().catch(console.error); 