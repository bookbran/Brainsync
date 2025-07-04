# 🧪 Test SMS Webhook with Intelligent Conversation Engine
# Simulates Twilio SMS webhook format

$ServerUrl = "http://localhost:3000"
$WebhookEndpoint = "/webhooks/sms"
$TestPhone = "+15551234567"

Write-Host "🎯 Testing Intelligent Conversation Engine via SMS Webhook" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""

# Test 1: New user starting brain dump (Phase 1)
Write-Host "📱 TEST 1: New User - Initial Brain Dump" -ForegroundColor Green
Write-Host "User texts: 'Hey goodberry, I need help prioritizing'" -ForegroundColor White
Write-Host ""

curl.exe -X POST "$ServerUrl$WebhookEndpoint" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "From=$TestPhone" `
  -d "Body=Hey goodberry, I need help prioritizing"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""

# Wait between requests
Start-Sleep -Seconds 3

# Test 2: Comprehensive brain dump
Write-Host "📱 TEST 2: Brain Dump - Multiple Priorities" -ForegroundColor Green
Write-Host "User texts: 'I need to finish my work presentation, spend more time with family, start exercising regularly, organize my home office, learn Spanish, and plan a vacation'" -ForegroundColor White
Write-Host ""

curl.exe -X POST "$ServerUrl$WebhookEndpoint" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "From=$TestPhone" `
  -d "Body=I need to finish my work presentation, spend more time with family, start exercising regularly, organize my home office, learn Spanish, and plan a vacation"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 3

# Test 3: Organization response (Phase 2)
Write-Host "📱 TEST 3: Organization - Work vs Personal" -ForegroundColor Green
Write-Host "User texts: 'Work stuff would be the presentation and networking. Personal is family time, exercise, vacation planning, and learning Spanish'" -ForegroundColor White
Write-Host ""

curl.exe -X POST "$ServerUrl$WebhookEndpoint" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "From=$TestPhone" `
  -d "Body=Work stuff would be the presentation and networking. Personal is family time, exercise, vacation planning, and learning Spanish"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 3

# Test 4: Simple continuation to test resume
Write-Host "📱 TEST 4: User Returns Later" -ForegroundColor Green
Write-Host "User texts: 'Hi again'" -ForegroundColor White
Write-Host ""

curl.exe -X POST "$ServerUrl$WebhookEndpoint" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "From=$TestPhone" `
  -d "Body=Hi again"

Write-Host ""
Write-Host "🎉 SMS Webhook Testing Complete!" -ForegroundColor Magenta
Write-Host ""
Write-Host "Check your server logs to see:" -ForegroundColor Yellow
Write-Host "✅ Intelligent conversation responses" -ForegroundColor Green
Write-Host "✅ Claude AI data extraction decisions" -ForegroundColor Green
Write-Host "✅ Phase progression based on AI analysis" -ForegroundColor Green
Write-Host "✅ Progress celebration for returning users" -ForegroundColor Green

