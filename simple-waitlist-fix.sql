-- Simple Waitlist Fix for Older Supabase Versions
-- Run this in your Supabase SQL Editor

-- Step 1: Check if table exists and its structure
SELECT 'Table check:' as info;
SELECT count(*) as row_count FROM waitlist;

-- Step 2: Check table structure (compatible with older PG versions)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'waitlist' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check existing policies (compatible version)
SELECT 'Current policies:' as info;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename = 'waitlist';

-- Step 4: Remove ALL existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON waitlist;
DROP POLICY IF EXISTS "allow_anonymous_insert" ON waitlist;
DROP POLICY IF EXISTS "allow_authenticated_select" ON waitlist;

-- Step 5: Disable RLS temporarily to test basic functionality
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Step 6: Test basic insert (should work without RLS)
INSERT INTO waitlist (email, source) VALUES ('test-basic@example.com', 'sql_test');
SELECT 'Basic insert worked!' as result WHERE EXISTS (SELECT 1 FROM waitlist WHERE email = 'test-basic@example.com');
DELETE FROM waitlist WHERE email = 'test-basic@example.com';

-- Step 7: Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Step 8: Grant permissions first (important!)
GRANT INSERT ON waitlist TO anon;
GRANT SELECT ON waitlist TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Step 9: Create simple, explicit policies
CREATE POLICY "anon_insert" ON waitlist
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "auth_select" ON waitlist
    FOR SELECT 
    TO authenticated
    USING (true);

-- Step 10: Test with RLS enabled
INSERT INTO waitlist (email, source) VALUES ('test-final@example.com', 'sql_test');
SELECT 'RLS insert worked!' as result WHERE EXISTS (SELECT 1 FROM waitlist WHERE email = 'test-final@example.com');
DELETE FROM waitlist WHERE email = 'test-final@example.com';

-- Step 11: Show final status
SELECT 'Final policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'waitlist';

SELECT 'Setup complete!' as status; 