import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://tlxnnikyoxzovmelhedb.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseG5uaWt5b3h6b3ZtZWxoZWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDg4OTEsImV4cCI6MjA0OTI4NDg5MX0.CfWvYJFXNANKKj9V6jgP9yoJ84_Dm6ddpxh_GQYwfnk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Waitlist signup function
export const addToWaitlist = async (email: string, name?: string, phone?: string, smsConsent?: boolean, feedbackInterest?: number) => {
  try {
    // Check for duplicate email first
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return { 
        success: false, 
        isDuplicate: true,
        error: 'We already have you on the waitlist! 🎉' 
      };
    }

    // If checkError is not "PGRST116" (no rows found), then it's a real error
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for duplicate:', checkError);
      return { success: false, error: 'Error checking waitlist. Please try again.' };
    }

    // Start with just the required email field
    const insertData: any = { 
      email: email.toLowerCase().trim(),
      feedback_interest: feedbackInterest || 1 // Default to 1 if not provided
    }
    
    // Only add optional fields if they have values
    if (name && name.trim()) {
      insertData.name = name.trim();
    }
    
    if (phone && phone.trim()) {
      insertData.phone = phone.trim();
    }
    
    if (smsConsent !== undefined) {
      insertData.sms_consent = smsConsent;
    }

    // Add source to track where signups come from
    insertData.source = 'calendar_landing';

    const { data, error } = await supabase
      .from('waitlist')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Error adding to waitlist:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }

    console.log('Successfully added to waitlist:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error adding to waitlist:', error);
    return { success: false, error }
  }
}

// App wishlist function - stores thoughts in the waitlist table
export const addAppWishlist = async (email: string, apps: string) => {
  try {
    console.log('DEBUG: Starting addAppWishlist with:', { email, apps })
    
    // First, let's check if the user exists in the waitlist table
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist')
      .select('email, id')
      .eq('email', email.toLowerCase().trim())
      .single();

    console.log('DEBUG: User lookup result:', { existingUser, checkError })

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('DEBUG: Error checking for user:', checkError)
      return { success: false, error: 'Error finding user record: ' + checkError.message }
    }

    if (!existingUser) {
      console.error('DEBUG: No user found with email:', email)
      return { success: false, error: 'Please complete the waitlist signup first, then submit your thoughts.' }
    }

    // Use the user's ID for a more reliable update (avoids email matching issues)
    console.log('DEBUG: Attempting to update user record with thoughts using ID:', existingUser.id)
    const { data, error } = await supabase
      .from('waitlist')
      .update({ app_wishlist: apps })
      .eq('id', existingUser.id)
      .select()

    console.log('DEBUG: Update result:', { data, error })

    if (error) {
      console.error('DEBUG: Supabase update error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return { success: false, error: 'Database error: ' + error.message }
    }
    
    if (!data || data.length === 0) {
      console.error('DEBUG: Update succeeded but no data returned - likely permissions issue')
      // Try a different approach - direct RPC call
      console.log('DEBUG: Attempting fallback method...')
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('update_waitlist_thoughts', {
            user_id: existingUser.id,
            thoughts: apps
          });
        
        if (rpcError) {
          console.error('DEBUG: RPC fallback also failed:', rpcError)
          return { success: false, error: 'Permission denied: Cannot update thoughts. Please contact support.' }
        }
        
        console.log('DEBUG: RPC fallback succeeded:', rpcData)
        return { success: true, data: rpcData }
      } catch (rpcErr) {
        console.error('DEBUG: RPC function does not exist, this is a permissions issue')
        return { success: false, error: 'Unable to save thoughts due to database permissions. Your signup was successful though!' }
      }
    }
    
    console.log('DEBUG: Successfully updated app wishlist:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('DEBUG: Caught exception in addAppWishlist:', error)
    return { success: false, error: error.message || 'Unknown error occurred' }
  }
} 