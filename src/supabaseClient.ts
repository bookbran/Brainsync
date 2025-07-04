import { createClient } from '@supabase/supabase-js'

// Use environment variables from .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gipyugcjodeezithfxwg.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcHl1Z2Nqb2RlZXppdGhmeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTgyMzksImV4cCI6MjA2NDI5NDIzOX0.GkHlfMhaIcOamJtdu5ILzOvthoLxofakgM-Aw66CuTA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Waitlist signup function with better error handling
export const addToWaitlist = async (email: string, name?: string, phone?: string) => {
  try {
    console.log('Attempting to add to waitlist:', { email, name, phone })
    
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          name: name || '',
          phone: phone || '',
          created_at: new Date().toISOString(),
          source: 'landing_page'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Successfully added to waitlist:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return { success: false, error: error.message || 'Unknown error occurred' }
  }
}

// Function to add app wishlist items
export const addAppWishlist = async (email: string, apps: string) => {
  try {
    console.log('Adding app wishlist:', { email, apps })
    
    const { data, error } = await supabase
      .from('app_wishlist')
      .insert([
        {
          email,
          apps,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error for app wishlist:', error)
      throw error
    }
    
    console.log('Successfully added app wishlist:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error adding app wishlist:', error)
    return { success: false, error: error.message || 'Unknown error occurred' }
  }
} 