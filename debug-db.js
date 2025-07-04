require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugDatabase() {
  console.log('🔍 Database Debug Test');
  console.log('===================');
  
  // Test 1: Check environment variables
  console.log('\n1. Environment Variables:');
  console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.log('   ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing');
  
  try {
    // Test 2: Basic connection
    console.log('\n2. Testing basic Supabase connection...');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test 3: Check users table structure
    console.log('\n3. Testing users table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Users table query failed:', tableError.message);
      return;
    }
    
    console.log('✅ Users table exists and is accessible');
    console.log('📊 Current users count:', tableInfo?.length || 0);
    
    // Test 4: Try to insert a test user
    console.log('\n4. Testing user creation...');
    const testPhone = '+15551234999';
    const testEmail = `test_${Date.now()}@example.com`;
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        phone: testPhone,
        email: testEmail,
        name: 'Test User',
        adhd_diagnosis: false
      }])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ User creation failed:', insertError.message);
      console.log('📋 Insert error details:', insertError);
      return;
    }
    
    console.log('✅ User creation successful');
    console.log('👤 Created user:', newUser);
    
    // Clean up test user
    await supabase
      .from('users')
      .delete()
      .eq('id', newUser.id);
    
    console.log('🧹 Cleaned up test user');
    
    // Test 5: Test conversation creation
    console.log('\n5. Testing conversations table...');
    const { data: convTest, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (convError) {
      console.log('❌ Conversations table issue:', convError.message);
    } else {
      console.log('✅ Conversations table accessible');
    }
    
    console.log('\n🎉 Database debug complete!');
    
  } catch (error) {
    console.error('🚨 Unexpected error:', error);
  }
}

debugDatabase().then(() => {
  console.log('\n✅ Debug finished');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
}); 