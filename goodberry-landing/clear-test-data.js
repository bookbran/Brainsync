// Clear test data from Supabase waitlist table
console.log('Loading Supabase client...');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tlxnnikyoxzovmelhedb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseG5uaWt5b3h6b3ZtZWxoZWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDg4OTEsImV4cCI6MjA0OTI4NDg5MX0.CfWvYJFXNANKKj9V6jgP9yoJ84_Dm6ddpxh_GQYwfnk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearTestData() {
  try {
    console.log('🧹 Clearing test data from waitlist table...');
    
    // First, let's see what we have
    const { data: allRecords, error: fetchError } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('Error fetching records:', fetchError);
      return;
    }
    
    console.log(`Found ${allRecords.length} records in waitlist table:`);
    allRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.email} (${record.name || 'No name'}) - Created: ${record.created_at}`);
    });
    
    // Delete all records to start fresh
    if (allRecords.length > 0) {
      const { error: deleteError } = await supabase
        .from('waitlist')
        .delete()
        .neq('id', 'this-will-never-match');
      
      if (deleteError) {
        console.error('Error deleting records:', deleteError);
        return;
      }
      
      console.log(`✅ Successfully cleared ${allRecords.length} test records!`);
    } else {
      console.log('✅ No records found - database is already clean!');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

clearTestData(); 