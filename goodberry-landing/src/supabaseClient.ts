import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gipyugcjodeezithfxwg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcHl1Z2Nqb2RlZXppdGhmeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTgyMzksImV4cCI6MjA2NDI5NDIzOX0.1D_UYdBEAM9oZTYU0-I3Xg1YTxJdaUzgdL0F_cJhkTI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Waitlist signup function
export const addToWaitlist = async (email: string, name?: string, phone?: string, smsConsent?: boolean) => {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          name: name || '',
          phone: phone || '',
          sms_consent: smsConsent || false,
          created_at: new Date().toISOString(),
          source: 'landing_page'
        }
      ])

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error adding to waitlist:', error)
    return { success: false, error }
  }
} 