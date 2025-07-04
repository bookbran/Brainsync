const StructuredPrioritizationEngine = require('./src/services/structuredPrioritizationEngine');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDirectEngine() {
  try {
    console.log('🧪 Testing StructuredPrioritizationEngine directly...');
    
    // Create a test user first
    const phoneNumber = '+15555554444';
    console.log('👤 Creating test user...');
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        phone: phoneNumber,
        email: `phone_${phoneNumber.replace(/\D/g, '')}@example.com`,
        name: `User ${phoneNumber.slice(-4)}`,
        adhd_diagnosis: false
      }])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ User creation failed:', insertError);
      return;
    }
    
    console.log('✅ Created test user:', newUser.id);
    
    // Now test the StructuredPrioritizationEngine
    console.log('\n🎯 Testing StructuredPrioritizationEngine.processConversation...');
    
    const engine = new StructuredPrioritizationEngine();
    
    const result = await engine.processConversation(
      newUser.id,
      'Hi there! I\'m new here.',
      null  // No existing conversation
    );
    
    console.log('✅ Engine result:', {
      conversationId: result.conversationId,
      currentPhase: result.currentPhase,
      response: result.response.substring(0, 100) + '...',
      phaseCompleted: result.phaseCompleted,
      isResuming: result.isResuming
    });
    
    // Clean up
    await supabase.from('conversations').delete().eq('user_id', newUser.id);
    await supabase.from('users').delete().eq('id', newUser.id);
    console.log('🧹 Cleaned up test data');
    
  } catch (error) {
    console.error('❌ Direct engine test failed:');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testDirectEngine(); 