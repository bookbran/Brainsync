-- Fix Waitlist Table RLS Policy
-- Run this in your Supabase SQL Editor to fix the anonymous insert issue

-- First, check if the table exists and what columns it has
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'waitlist' AND table_schema = 'public';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads" ON waitlist;

-- Create policy to allow anonymous inserts (for the landing page signup form)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin purposes)
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Verify the table structure (optional - you can run this to check)
-- SELECT * FROM waitlist LIMIT 1;

-- Test anonymous insert (optional - you can run this to test)
-- INSERT INTO waitlist (email, source) VALUES ('test@example.com', 'sql_test');
-- DELETE FROM waitlist WHERE email = 'test@example.com';

-- Make sure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY; 