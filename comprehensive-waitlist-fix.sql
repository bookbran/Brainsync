-- Comprehensive Waitlist Table Fix
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Check if table exists
SELECT 'Table exists' as status, count(*) as row_count FROM waitlist;

-- Step 2: Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check current RLS status
SELECT schemaname, tablename, rowsecurity, forcerlspolicy 
FROM pg_tables 
WHERE tablename = 'waitlist';

-- Step 4: Check existing policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'waitlist';

-- Step 5: Disable RLS temporarily to test
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Step 6: Test if anonymous can insert without RLS
INSERT INTO waitlist (email, source) VALUES ('test-no-rls@example.com', 'sql_test');
DELETE FROM waitlist WHERE email = 'test-no-rls@example.com';

-- Step 7: Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Step 8: Drop ALL existing policies (nuclear option)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated reads" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON waitlist;

-- Step 9: Create new policies with explicit permissions
CREATE POLICY "allow_anonymous_insert" ON waitlist
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "allow_authenticated_select" ON waitlist
    FOR SELECT 
    TO authenticated
    USING (true);

-- Step 10: Grant explicit permissions to anon role
GRANT INSERT ON waitlist TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Step 11: Test the fix
INSERT INTO waitlist (email, source) VALUES ('test-after-fix@example.com', 'sql_test');
SELECT 'Insert successful!' as result WHERE EXISTS (SELECT 1 FROM waitlist WHERE email = 'test-after-fix@example.com');
DELETE FROM waitlist WHERE email = 'test-after-fix@example.com';

-- Step 12: Show final policy status
SELECT 'Final policies:' as info;
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'waitlist'; 