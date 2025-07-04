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

// ALTERNATIVE VERSION: App wishlist function using database function
// This version is more robust and handles edge cases better
export const addAppWishlist = async (email: string, apps: string) => {
  try {
    console.log('Adding app wishlist using database function:', { email, apps })
    
    // Call the database function that handles both insert and update
    const { data, error } = await supabase
      .rpc('upsert_app_wishlist', {
        user_email: email,
        user_thoughts: apps
      });

    if (error) {
      console.error('Supabase RPC error for app wishlist:', error)
      throw error
    }
    
    // The function returns a JSON object with success/error info
    if (data && data.success) {
      console.log('Successfully added app wishlist via function:', data)
      return { success: true, data }
    } else {
      console.error('Database function returned error:', data)
      return { success: false, error: data?.error || 'Unknown database error' }
    }
  } catch (error: any) {
    console.error('Error calling app wishlist function:', error)
    return { success: false, error: error.message || 'Unknown error occurred' }
  }
} 