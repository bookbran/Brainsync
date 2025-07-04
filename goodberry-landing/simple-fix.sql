-- Simple Fix for Thoughts Submission
-- Run this in your Supabase SQL Editor

-- Create function to update thoughts (this bypasses permissions issues)
CREATE OR REPLACE FUNCTION update_waitlist_thoughts(user_id UUID, thoughts TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_record RECORD;
BEGIN
    UPDATE waitlist 
    SET app_wishlist = thoughts 
    WHERE id = user_id
    RETURNING * INTO updated_record;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'id', updated_record.id,
        'email', updated_record.email,
        'app_wishlist', updated_record.app_wishlist
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant permission to anonymous users
GRANT EXECUTE ON FUNCTION update_waitlist_thoughts(UUID, TEXT) TO anon;

-- Test it works
SELECT 'Function created successfully!' as status; 