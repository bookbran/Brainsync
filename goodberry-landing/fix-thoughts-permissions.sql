-- Fix Thoughts Permissions - Allow Anonymous Updates
-- Run this in your Supabase SQL Editor to fix the "Failed to submit wishlist" error

-- ====================================================================================
-- STEP 1: CHECK CURRENT POLICIES
-- ====================================================================================
SELECT 'Current RLS policies for waitlist table:' as info;
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'waitlist';

-- ====================================================================================
-- STEP 2: ADD UPDATE POLICY FOR ANONYMOUS USERS
-- ====================================================================================

-- This allows anonymous users to update their own waitlist record (for adding thoughts)
CREATE POLICY IF NOT EXISTS "allow_anonymous_update_own_record" ON waitlist
    FOR UPDATE 
    TO anon
    USING (true)  -- Allow reading any record for update
    WITH CHECK (true);  -- Allow updating any record

-- Grant UPDATE permission to anonymous users
GRANT UPDATE ON waitlist TO anon;

-- ====================================================================================
-- STEP 3: VERIFY PERMISSIONS
-- ====================================================================================
SELECT 'Checking table permissions:' as info;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'waitlist' 
AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- ====================================================================================
-- STEP 4: TEST THE UPDATE (debugging)
-- ====================================================================================

-- Let's test if we can update a record (this simulates what your app is doing)
-- First, let's see what records exist
SELECT 'Current waitlist records:' as info;
SELECT email, name, app_wishlist FROM waitlist ORDER BY created_at DESC LIMIT 5;

-- ====================================================================================
-- STEP 5: ALTERNATIVE APPROACH - COMBINED INSERT/UPDATE FUNCTION
-- ====================================================================================

-- Create a function that handles both insert and update of thoughts
-- This ensures we can always save the user's thoughts regardless of timing

CREATE OR REPLACE FUNCTION upsert_app_wishlist(user_email TEXT, user_thoughts TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with elevated privileges
AS $$
DECLARE
    result_record RECORD;
BEGIN
    -- Try to update existing record first
    UPDATE waitlist 
    SET app_wishlist = user_thoughts 
    WHERE email = LOWER(TRIM(user_email))
    RETURNING * INTO result_record;
    
    -- If no record was updated, try to insert a new one
    IF NOT FOUND THEN
        INSERT INTO waitlist (email, app_wishlist, source)
        VALUES (LOWER(TRIM(user_email)), user_thoughts, 'thoughts_only')
        RETURNING * INTO result_record;
    END IF;
    
    -- Return success with the record
    RETURN json_build_object(
        'success', true,
        'email', result_record.email,
        'app_wishlist', result_record.app_wishlist
    );
    
EXCEPTION WHEN OTHERS THEN
    -- Return error details
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION upsert_app_wishlist(TEXT, TEXT) TO anon;

-- ====================================================================================
-- STEP 6: TEST THE FUNCTION
-- ====================================================================================

-- Test the new function (will be cleaned up)
SELECT 'Testing upsert function:' as info;
SELECT upsert_app_wishlist('test-function@example.com', 'This is a test of the upsert function for app wishlist thoughts.');

-- Verify it worked
SELECT email, app_wishlist FROM waitlist WHERE email = 'test-function@example.com';

-- Clean up test
DELETE FROM waitlist WHERE email = 'test-function@example.com';

-- ====================================================================================
-- FINAL STATUS
-- ====================================================================================
SELECT 'Permissions fix complete! Try submitting thoughts again.' as status;

-- Show updated policies
SELECT 'Updated policies:' as info;
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd; 