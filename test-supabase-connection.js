#!/usr/bin/env node

// Test Supabase Connection and Schema Export
// Run this with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')

// Same credentials as in your app
const supabaseUrl = 'https://gipyugcjodeezithfxwg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcHl1Z2Nqb2RlZXppdGhmeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTgyMzksImV4cCI6MjA2NDI5NDIzOX0.GkHlfMhaIcOamJtdu5ILzOvthoLxofakgM-Aw66CuTA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')
  
  try {
    // Test 1: Basic connection
    console.log('✅ Step 1: Testing basic connection...')
    const { data: testData, error: testError } = await supabase
      .from('waitlist')
      .select('count', { count: 'exact', head: true })
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message)
      return
    }
    console.log(`✅ Connected! Found ${testData} records in waitlist table\n`)

    // Test 2: Check waitlist table structure  
    console.log('📋 Step 2: Checking waitlist table structure...')
    const { data: waitlistData, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1)
    
    if (waitlistError) {
      console.error('❌ Waitlist table error:', waitlistError.message)
    } else {
      console.log('✅ Waitlist table accessible')
      if (waitlistData.length > 0) {
        console.log('Columns found:', Object.keys(waitlistData[0]).join(', '))
      }
    }

    // Test 3: Check app_wishlist table structure
    console.log('\n📋 Step 3: Checking app_wishlist table structure...')
    const { data: wishlistData, error: wishlistError } = await supabase
      .from('app_wishlist')
      .select('*')
      .limit(1)
    
    if (wishlistError) {
      console.error('❌ App wishlist table error:', wishlistError.message)
    } else {
      console.log('✅ App wishlist table accessible')
      if (wishlistData.length > 0) {
        console.log('Columns found:', Object.keys(wishlistData[0]).join(', '))
      }
    }

    // Test 4: Test insert permissions
    console.log('\n🔐 Step 4: Testing insert permissions...')
    const testEmail = `test-${Date.now()}@example.com`
    
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert([{
        email: testEmail,
        name: 'Test User',
        phone: '1234567890',
        source: 'connection_test'
      }])
      .select()

    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message)
      console.log('🔧 This might be a RLS (Row Level Security) policy issue')
    } else {
      console.log('✅ Insert test successful!')
      console.log('Test record created:', insertData)
      
      // Clean up test record
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', testEmail)
      console.log('🧹 Test record cleaned up')
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

async function getTableSchemas() {
  console.log('\n📊 SUPABASE TABLE SCHEMAS')
  console.log('==================================================')
  
  try {
    // Get waitlist table schema
    console.log('\n🗂️  WAITLIST TABLE SCHEMA:')
    console.log('------------------------------')
    
    console.log(`
Expected Waitlist Table Structure:
- id: bigint (primary key, auto-increment)
- email: text (required)
- name: text (optional)
- phone: text (optional) 
- created_at: timestamptz (auto-set)
- source: text (default: 'landing_page')
`)

    console.log('\n🗂️  APP_WISHLIST TABLE SCHEMA:')
    console.log('------------------------------')
    console.log(`
Expected App Wishlist Table Structure:
- id: bigint (primary key, auto-increment)
- email: text (required)
- apps: text (required)
- created_at: timestamptz (auto-set)
`)

  } catch (error) {
    console.error('Schema query error:', error.message)
  }
}

// Run all tests
async function main() {
  await testConnection()
  await getTableSchemas()
  
  console.log('\n🎯 NEXT STEPS:')
  console.log('1. If insert test failed, check RLS policies in Supabase dashboard')
  console.log('2. Make sure anonymous users can INSERT into both tables')
  console.log('3. Test the actual form on your website')
  console.log('\n💡 If you see any errors above, copy them and we can fix the setup!')
}

main().catch(console.error) 