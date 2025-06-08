-- Goodberry Waitlist Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS waitlist (
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
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for signup)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT 
  WITH CHECK (true);

-- Allow reading for authenticated users (for admin)
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at 
  BEFORE UPDATE ON waitlist 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 