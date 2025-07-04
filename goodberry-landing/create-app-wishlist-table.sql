-- Create App Wishlist Table
-- Run this in your Supabase SQL Editor to create the missing app_wishlist table

-- ====================================================================================
-- CREATE THE APP_WISHLIST TABLE
-- ====================================================================================

CREATE TABLE IF NOT EXISTS app_wishlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  apps text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS app_wishlist_email_idx ON app_wishlist(email);
CREATE INDEX IF NOT EXISTS app_wishlist_created_at_idx ON app_wishlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE app_wishlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the wishlist form)
CREATE POLICY IF NOT EXISTS "allow_anonymous_insert_app_wishlist" ON app_wishlist
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read (for admin)
CREATE POLICY IF NOT EXISTS "allow_authenticated_read_app_wishlist" ON app_wishlist
  FOR SELECT 
  TO authenticated
  USING (true);

-- Grant permissions
GRANT INSERT ON app_wishlist TO anon;
GRANT SELECT ON app_wishlist TO authenticated;

-- ====================================================================================
-- VERIFY THE TABLE WAS CREATED
-- ====================================================================================

SELECT 'app_wishlist table created successfully!' as status;

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'app_wishlist' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test insert (will be deleted immediately)
INSERT INTO app_wishlist (email, apps) VALUES ('test@example.com', 'Test wishlist entry');
SELECT 'Test insert successful!' as test_result;
DELETE FROM app_wishlist WHERE email = 'test@example.com';

SELECT 'Setup complete! Your thoughts form should work now.' as final_status; 