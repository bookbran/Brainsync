-- =========================================
-- GOODBERRY WAITLIST DATABASE FIX SCRIPT
-- =========================================
-- This script handles existing tables and adds missing columns

-- 1. ADD MISSING COLUMNS TO EXISTING WAITLIST TABLE
-- =================================================

-- Add feedback_interest column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' 
        AND column_name = 'feedback_interest'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.waitlist 
        ADD COLUMN feedback_interest INTEGER DEFAULT 1 
        CHECK (feedback_interest >= 1 AND feedback_interest <= 5);
        
        -- Update existing records to have default feedback_interest of 1
        UPDATE public.waitlist SET feedback_interest = 1 WHERE feedback_interest IS NULL;
        
        RAISE NOTICE 'Added feedback_interest column to waitlist table';
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
        ALTER TABLE public.waitlist 
        ADD COLUMN source VARCHAR(100) DEFAULT 'landing_page';
        
        -- Update existing records to have default source
        UPDATE public.waitlist SET source = 'landing_page' WHERE source IS NULL;
        
        RAISE NOTICE 'Added source column to waitlist table';
    ELSE
        RAISE NOTICE 'source column already exists';
    END IF;
END $$;

-- Ensure email has unique constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'waitlist' 
        AND constraint_type = 'UNIQUE'
        AND constraint_name LIKE '%email%'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.waitlist ADD CONSTRAINT waitlist_email_unique UNIQUE (email);
        RAISE NOTICE 'Added unique constraint to email column';
    ELSE
        RAISE NOTICE 'Email unique constraint already exists';
    END IF;
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint already exists or duplicate emails found';
END $$;

-- 2. CREATE APP_WISHLIST TABLE IF NOT EXISTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.app_wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    wishlist_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ADD INDEXES FOR PERFORMANCE
-- ==============================
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_feedback_interest ON public.waitlist(feedback_interest);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON public.waitlist(source);
CREATE INDEX IF NOT EXISTS idx_app_wishlist_email ON public.app_wishlist(email);
CREATE INDEX IF NOT EXISTS idx_app_wishlist_created_at ON public.app_wishlist(created_at DESC);

-- 4. SET UP ROW LEVEL SECURITY (RLS)
-- ==================================
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_wishlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.waitlist;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON public.waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.app_wishlist;
DROP POLICY IF EXISTS "Enable read for anonymous users" ON public.app_wishlist;

-- Create fresh policies
CREATE POLICY "Enable insert for anonymous users" ON public.waitlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users" ON public.waitlist
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON public.app_wishlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users" ON public.app_wishlist
    FOR SELECT USING (true);

-- 5. CREATE ANALYTICS VIEWS
-- =========================
CREATE OR REPLACE VIEW public.waitlist_analytics AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE sms_consent = true) as sms_opted_in,
    COUNT(*) FILTER (WHERE phone IS NOT NULL) as with_phone,
    ROUND(AVG(feedback_interest), 2) as avg_feedback_interest,
    COUNT(*) FILTER (WHERE feedback_interest >= 4) as high_engagement_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as signups_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as signups_last_7d,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as signups_last_30d
FROM public.waitlist;

CREATE OR REPLACE VIEW public.feedback_interest_breakdown AS
SELECT 
    feedback_interest,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM public.waitlist), 0), 2) as percentage
FROM public.waitlist
GROUP BY feedback_interest
ORDER BY feedback_interest;

CREATE OR REPLACE VIEW public.signup_sources AS
SELECT 
    source,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM public.waitlist), 0), 2) as percentage,
    MAX(created_at) as last_signup
FROM public.waitlist
GROUP BY source
ORDER BY count DESC;

-- 6. CREATE HELPER FUNCTIONS
-- ==========================
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::INTEGER FROM public.waitlist;
$$;

CREATE OR REPLACE FUNCTION public.email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(SELECT 1 FROM public.waitlist WHERE LOWER(email) = LOWER(check_email));
$$;

-- 7. VALIDATION QUERIES
-- =====================
-- Check table structure
SELECT 'waitlist table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'waitlist'
ORDER BY ordinal_position;

SELECT 'app_wishlist table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'app_wishlist'
ORDER BY ordinal_position;

-- Test analytics
SELECT 'Current analytics:' as info;
SELECT * FROM public.waitlist_analytics;

SELECT 'Feedback breakdown:' as info;
SELECT * FROM public.feedback_interest_breakdown;

-- =========================================
-- SCRIPT COMPLETE!
-- ========================================= 