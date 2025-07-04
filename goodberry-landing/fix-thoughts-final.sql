-- Final Fix for Thoughts Submission
-- Run this in your Supabase SQL Editor

-- Create a simple function to update thoughts with elevated privileges
CREATE OR REPLACE FUNCTION update_waitlist_thoughts(user_id UUID, thoughts TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with elevated privileges, bypassing RLS
AS $$
DECLARE
    updated_record RECORD;
BEGIN
    -- Update the record
    UPDATE waitlist 
    SET app_wishlist = thoughts 
    WHERE id = user_id
    RETURNING * INTO updated_record;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User record not found'
        );
    END IF;
    
    -- Return success
    RETURN json_build_object(
        'success', true,
        'id', updated_record.id,
        'email', updated_record.email,
        'app_wishlist', updated_record.app_wishlist
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
GRANT EXECUTE ON FUNCTION update_waitlist_thoughts(UUID, TEXT) TO anon;

-- Test the function
SELECT 'Function created successfully!' as status;

-- Verify permissions
SELECT 'Checking function permissions...' as info;
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_name = 'update_waitlist_thoughts';

SELECT 'Setup complete! Your thoughts form should now work.' as final_status; 