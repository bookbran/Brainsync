// Simple Supabase Test
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://gipyugcjodeezithfxwg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcHl1Z2Nqb2RlZXppdGhmeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTgyMzksImV4cCI6MjA2NDI5NDIzOX0.GkHlfMhaIcOamJtdu5ILzOvthoLxofakgM-Aw66CuTA'
)

async function test() {
  console.log('Testing Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1)
      
    console.log('Data:', data)
    console.log('Error:', error)
  } catch (err) {
    console.log('Caught error:', err.message)
  }
}

test() 