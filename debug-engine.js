const StructuredPrioritizationEngine = require('./src/services/structuredPrioritizationEngine');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get user by phone number (same as webhook)
 */
async function getUserByPhone(phoneNumber) {
  try {
    console.log('🔍 Looking up user by phone:', phoneNumber);
    
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phoneNumber)
      .single();
    
    console.log('📊 User lookup result:', { existingUser, selectError });
    
    if (existingUser && !selectError) {
      console.log('✅ Found existing user:', existingUser.id);
      return existingUser;
    }
    
    console.log('🆕 Creating new user for phone:', phoneNumber);
    
    // Create new user if doesn't exist
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
    
    console.log('📊 User creation result:', { newUser, insertError });
    
    if (insertError) throw insertError;
    
    return newUser;
    
  } catch (error) {
    console.error('🚨 getUserByPhone ERROR:', error);
    throw error;
  }
}

async function debugEngine() {
  console.log('🔍 Testing StructuredPrioritizationEngine with real webhook flow...');
  
  try {
    console.log('1️⃣ Creating engine instance...');
    const engine = new StructuredPrioritizationEngine();
    
    console.log('2️⃣ Getting user (like webhook does)...');
    const user = await getUserByPhone('+15557777777');
    console.log('User ID:', user.id, 'Type:', typeof user.id);
    
    console.log('3️⃣ Testing processConversation with real user ID...');
    const result = await engine.processConversation(
      user.id,
      'whooboy.. is this gonna work?',
      user.active_conversation_id
    );
    
    console.log('✅ Engine working! Result:', result);
    
  } catch (error) {
    console.error('❌ Engine error:', error);
    console.error('Stack:', error.stack);
  }
}

debugEngine(); 