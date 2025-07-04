const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tlxnnikyoxzovmelhedb.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseG5uaWt5b3h6b3ZtZWxoZWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDg4OTEsImV4cCI6MjA0OTI4NDg5MX0.CfWvYJFXNANKKj9V6jgP9yoJ84_Dm6ddpxh_GQYwfnk'
);

async function clearTestData() {
  try {
    console.log('🧹 Clearing test data from waitlist table...');
    
    // First, let's see what we have
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching records:', error);
      return;
    }
    
    console.log(`📊 Found ${data.length} records in waitlist table`);
    
    if (data.length > 0) {
      data.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.email} (${record.name || 'No name'})`);
      });
      
      // Delete all records for a fresh start
      const { error: deleteError } = await supabase
        .from('waitlist')
        .delete()
        .neq('id', 'this-will-never-match-anything');
      
      if (deleteError) {
        console.error('❌ Error deleting records:', deleteError);
        return;
      }
      
      console.log(`✅ Successfully cleared ${data.length} test records!`);
    } else {
      console.log('✅ Database is already clean - no records found!');
    }
    
    console.log('🎉 Test data cleanup complete!');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

clearTestData();
