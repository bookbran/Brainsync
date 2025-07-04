-- Fresh Waitlist Table Setup for New Supabase Project
-- Run this entire script in your new Supabase SQL Editor

-- Create the waitlist table with proper structure
CREATE TABLE waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  sms_consent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  source text DEFAULT 'landing_page',
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX waitlist_email_idx ON waitlist(email);
CREATE INDEX waitlist_created_at_idx ON waitlist(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to INSERT (for signup)
CREATE POLICY "allow_anonymous_signup" ON waitlist
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to SELECT (for admin)
CREATE POLICY "allow_authenticated_read" ON waitlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT INSERT ON waitlist TO anon;
GRANT SELECT ON waitlist TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Test the setup
INSERT INTO waitlist (email, name, source) 
VALUES ('test@example.com', 'Test User', 'sql_setup');

-- Verify the test worked
SELECT 'Setup successful!' as status, count(*) as test_records 
FROM waitlist WHERE email = 'test@example.com';

-- Clean up test record
DELETE FROM waitlist WHERE email = 'test@example.com';

-- Final verification
SELECT 'Table ready!' as status, 
       count(*) as total_records,
       'Policies created' as policies_status
FROM waitlist; 