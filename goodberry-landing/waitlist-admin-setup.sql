-- Waitlist Admin Setup & Troubleshooting Script
-- Run this in your Supabase SQL Editor
-- This script will add the "thoughts" column and help troubleshoot your admin panel

-- ====================================================================================
-- STEP 1: CHECK CURRENT TABLE STRUCTURE
-- ====================================================================================
SELECT 'Current table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ====================================================================================
-- STEP 2: ADD MISSING COLUMNS IF THEY DON'T EXIST
-- ====================================================================================

-- Add app_wishlist column (for "thoughts") if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' 
        AND column_name = 'app_wishlist'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE waitlist ADD COLUMN app_wishlist TEXT;
        RAISE NOTICE 'Added app_wishlist column for user thoughts/feedback';
    ELSE
        RAISE NOTICE 'app_wishlist column already exists';
    END IF;
END $$;

-- Add feedback_interest column if it doesn't exist  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' 
        AND column_name = 'feedback_interest'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE waitlist ADD COLUMN feedback_interest INTEGER DEFAULT 1;
        RAISE NOTICE 'Added feedback_interest column';
    ELSE
        RAISE NOTICE 'feedback_interest column already exists';
    END IF;
END $$;

-- Add source column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' 
        AND column_name = 'source'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE waitlist ADD COLUMN source TEXT DEFAULT 'landing_page';
        RAISE NOTICE 'Added source column';
    ELSE
        RAISE NOTICE 'source column already exists';
    END IF;
END $$;

-- ====================================================================================
-- STEP 3: VERIFY TABLE STRUCTURE AFTER UPDATES
-- ====================================================================================
SELECT 'Updated table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ====================================================================================
-- STEP 4: CHECK CURRENT DATA
-- ====================================================================================
SELECT 'Current waitlist data summary:' as info;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as records_with_email,
    COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as records_with_name,
    COUNT(CASE WHEN app_wishlist IS NOT NULL AND app_wishlist != '' THEN 1 END) as records_with_thoughts,
    COUNT(CASE WHEN feedback_interest IS NOT NULL THEN 1 END) as records_with_feedback_interest
FROM waitlist;

-- ====================================================================================
-- STEP 5: SHOW SAMPLE DATA (for troubleshooting)
-- ====================================================================================
SELECT 'Sample waitlist entries:' as info;
SELECT 
    id,
    email,
    name,
    phone,
    sms_consent,
    feedback_interest,
    CASE 
        WHEN app_wishlist IS NULL THEN 'NULL'
        WHEN app_wishlist = '' THEN 'EMPTY'
        ELSE LEFT(app_wishlist, 50) || '...'
    END as thoughts_preview,
    source,
    created_at
FROM waitlist 
ORDER BY created_at DESC 
LIMIT 5;

-- ====================================================================================
-- STEP 6: TEST ADMIN QUERY (what your admin panel runs)
-- ====================================================================================
SELECT 'Admin panel query test:' as info;
SELECT 
    email,
    name,
    phone,
    sms_consent,
    feedback_interest,
    app_wishlist,
    source,
    created_at
FROM waitlist 
ORDER BY created_at DESC;

-- ====================================================================================
-- STEP 7: ADD SAMPLE TEST DATA (optional - uncomment if you want test data)
-- ====================================================================================
/*
-- Uncomment this section if you want to add test data for debugging
INSERT INTO waitlist (email, name, phone, sms_consent, feedback_interest, app_wishlist, source) VALUES 
(
    'test1@example.com', 
    'Test User 1', 
    '+1234567890', 
    true, 
    3, 
    'I use Notion but always forget to check it. My biggest problem is remembering to eat lunch. I wish something helped me transition between tasks without getting distracted.',
    'admin_test'
),
(
    'test2@example.com', 
    'Test User 2', 
    NULL, 
    false, 
    5, 
    'Love the idea! I currently use Apple Calendar but it doesnt understand my ADHD brain at all. Would love integration with Spotify for focus music.',
    'admin_test'
);

SELECT 'Test data added!' as result;
*/

-- ====================================================================================
-- STEP 8: CHECK PERMISSIONS & POLICIES
-- ====================================================================================
SELECT 'Current RLS policies:' as info;
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'waitlist';

-- ====================================================================================
-- STEP 9: FINAL VERIFICATION
-- ====================================================================================
SELECT 'Final verification - Everything should work now!' as status;
SELECT 
    'waitlist' as table_name,
    COUNT(*) as total_records,
    MAX(created_at) as latest_signup,
    CASE WHEN COUNT(*) > 0 THEN 'DATA EXISTS' ELSE 'NO DATA' END as data_status
FROM waitlist;

-- ====================================================================================
-- TROUBLESHOOTING NOTES:
-- ====================================================================================
/*
If your admin panel still shows 0 records after running this script:

1. Check that you committed and pushed the FocusedSignup.tsx fix
2. Make sure your Supabase credentials are correct in supabaseClient.ts
3. Try refreshing the page and clicking the admin panel again
4. Check browser console for any error messages
5. Verify you're clicking the correct waitlist number (in FocusedSignup component)

The admin panel should now show:
- Email, Name, Phone, SMS Consent
- Feedback Interest (1-5 scale)  
- Thoughts (app_wishlist content)
- Source, Created At

Password: sunnylovescheese
*/ 