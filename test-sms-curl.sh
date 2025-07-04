#!/bin/bash

# 🧪 Test SMS Webhook with Intelligent Conversation Engine
# Simulates Twilio SMS webhook format

SERVER_URL="http://localhost:3000"
WEBHOOK_ENDPOINT="/webhooks/sms"
TEST_PHONE="+15551234567"

echo "🎯 Testing Intelligent Conversation Engine via SMS Webhook"
echo "=================================================="
echo ""

# Test 1: New user starting brain dump (Phase 1)
echo "📱 TEST 1: New User - Initial Brain Dump"
echo "User texts: 'Hey goodberry, I need help prioritizing'"
echo ""

curl -X POST "${SERVER_URL}${WEBHOOK_ENDPOINT}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=${TEST_PHONE}" \
  -d "Body=Hey goodberry, I need help prioritizing"

echo ""
echo "=================================================="
echo ""

# Wait a moment between requests
sleep 2

# Test 2: Comprehensive brain dump
echo "📱 TEST 2: Brain Dump - Multiple Priorities"
echo "User texts: 'I need to finish my work presentation, spend more time with family, start exercising regularly, organize my home office, learn Spanish, and plan a vacation'"
echo ""

curl -X POST "${SERVER_URL}${WEBHOOK_ENDPOINT}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=${TEST_PHONE}" \
  -d "Body=I need to finish my work presentation, spend more time with family, start exercising regularly, organize my home office, learn Spanish, and plan a vacation"

echo ""
echo "=================================================="
echo ""

sleep 2

# Test 3: Organization response (Phase 2)
echo "📱 TEST 3: Organization - Work vs Personal"
echo "User texts: 'Work stuff would be the presentation and networking. Personal is family time, exercise, vacation planning, and learning Spanish'"
echo ""

curl -X POST "${SERVER_URL}${WEBHOOK_ENDPOINT}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=${TEST_PHONE}" \
  -d "Body=Work stuff would be the presentation and networking. Personal is family time, exercise, vacation planning, and learning Spanish"

echo ""
echo "=================================================="
echo ""

sleep 2

# Test 4: ADHD patterns (Phase 3)
echo "📱 TEST 4: ADHD Patterns - Planning Experiences"
echo "User texts: 'I tried using a planner before but it never worked. I would make elaborate weekend plans and then completely ignore them'"
echo ""

curl -X POST "${SERVER_URL}${WEBHOOK_ENDPOINT}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=${TEST_PHONE}" \
  -d "Body=I tried using a planner before but it never worked. I would make elaborate weekend plans and then completely ignore them"

echo ""
echo "=================================================="
echo ""

sleep 2

# Test 5: Energy patterns (Phase 4)
echo "📱 TEST 5: Energy Patterns - Daily Rhythms"
echo "User texts: 'I'm definitely a morning person - most focused between 9-11am. I crash hard around 2pm and need exercise to feel energized'"
echo ""

curl -X POST "${SERVER_URL}${WEBHOOK_ENDPOINT}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=${TEST_PHONE}" \
  -d "Body=I'm definitely a morning person - most focused between 9-11am. I crash hard around 2pm and need exercise to feel energized"

echo ""
echo "🎉 SMS Webhook Testing Complete!"
echo ""
echo "Check your server logs to see:"
echo "✅ Intelligent conversation responses"
echo "✅ Claude AI data extraction decisions"  
echo "✅ Phase progression based on AI analysis"
echo "✅ Progress celebration for returning users" 