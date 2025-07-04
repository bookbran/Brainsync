-- Admin Query for Separate Tables Approach
-- Use this if you created the separate app_wishlist table
-- This shows how to view waitlist data with thoughts from both tables

-- ====================================================================================
-- COMBINED VIEW: Waitlist + App Wishlist Data
-- ====================================================================================

SELECT 
    w.id,
    w.email,
    w.name,
    w.phone,
    w.sms_consent,
    w.feedback_interest,
    aw.apps as thoughts,
    w.source,
    w.created_at as signed_up_at,
    aw.created_at as thoughts_submitted_at
FROM waitlist w
LEFT JOIN app_wishlist aw ON w.email = aw.email
ORDER BY w.created_at DESC;

-- ====================================================================================
-- SUMMARY: How many people submitted thoughts?
-- ====================================================================================

SELECT 
    COUNT(DISTINCT w.email) as total_signups,
    COUNT(DISTINCT aw.email) as people_with_thoughts,
    ROUND(
        (COUNT(DISTINCT aw.email)::decimal / COUNT(DISTINCT w.email)) * 100, 1
    ) as thoughts_completion_percentage
FROM waitlist w
LEFT JOIN app_wishlist aw ON w.email = aw.email;

-- ====================================================================================
-- RECENT THOUGHTS (last 10)
-- ====================================================================================

SELECT 
    w.name,
    w.email,
    aw.apps as thoughts,
    aw.created_at as submitted_at
FROM app_wishlist aw
JOIN waitlist w ON w.email = aw.email
ORDER BY aw.created_at DESC
LIMIT 10; 