require('dotenv').config();
const { processUserMessage } = require('./src/services/messageProcessor');

console.log('🧪 Testing Simple Conversation Flow');
console.log('===================================');

async function testSimpleConversation() {
  try {
    console.log('🚀 Testing direct message processing...\n');
    
    const testPhone = '+15551234567';
    const testMessage = 'Hi goodberry, I need help with my priorities';
    
    console.log('📱 Input:', testMessage);
    console.log('📞 Phone:', testPhone);
    console.log('⏳ Processing...\n');
    
    const response = await processUserMessage(testPhone, testMessage);
    
    console.log('✅ Response received:');
    console.log('🤖 Goodberry:', response);
    
  } catch (error) {
    console.log('❌ ERROR in conversation flow:');
    console.log('Error message:', error.message);
    console.log('Stack trace:', error.stack);
  }
}

testSimpleConversation(); 