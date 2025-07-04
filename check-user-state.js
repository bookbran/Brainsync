const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserState() {
  try {
    console.log('🔍 Checking user state for Dan...');
    
    // First, find Dan's user record
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', '+155535491254');
    
    if (userError) {
      console.error('❌ Error fetching user:', userError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('❌ No user found with phone +155535491254');
      return;
    }
    
    const user = users[0];
    console.log('👤 User found:', {
      id: user.id,
      name: user.name,
      phone: user.phone,
      calendar_connected: user.calendar_connected,
      created_at: user.created_at
    });
    
    // Check conversations for this user
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (convError) {
      console.error('❌ Error fetching conversations:', convError);
      return;
    }
    
    console.log(`📝 Found ${conversations.length} conversations:`);
    
    conversations.forEach((conv, index) => {
      console.log(`\n${index + 1}. Conversation ${conv.id}:`);
      console.log(`   Type: ${conv.conversation_type}`);
      console.log(`   Phase: ${conv.current_phase}`);
      console.log(`   Status: ${conv.status}`);
      console.log(`   Created: ${conv.created_at}`);
      console.log(`   Updated: ${conv.updated_at}`);
      console.log(`   Phase completion status:`, conv.phase_completion_status);
    });
    
    // Check if there are any active structured_prioritization conversations
    const activeConvos = conversations.filter(c => 
      c.conversation_type === 'structured_prioritization' && 
      c.status === 'active'
    );
    
    if (activeConvos.length > 0) {
      console.log('\n🎯 Active structured prioritization conversations:');
      activeConvos.forEach(conv => {
        console.log(`   ID: ${conv.id}, Phase: ${conv.current_phase}`);
        console.log(`   Onboarding completed: ${conv.phase_completion_status?.onboarding_completed}`);
        console.log(`   Calendar consent requested: ${conv.phase_completion_status?.calendarConsentRequested}`);
      });
    } else {
      console.log('\n⚠️ No active structured prioritization conversations found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUserState(); 