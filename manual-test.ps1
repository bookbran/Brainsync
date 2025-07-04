# Manual Test Script for BrainSync Conversation Engine
# Run this in PowerShell to test your 10-phase system

# Use a unique phone number for testing
$phone = "+1555$(Get-Date -Format 'MMddHHmm')"
$message = "Hello, I need help with my schedule"

Write-Host "🧪 Testing Conversation Engine" -ForegroundColor Cyan
Write-Host "📱 Phone: $phone" -ForegroundColor Yellow
Write-Host "💬 Message: $message" -ForegroundColor Yellow
Write-Host ""

# Create webhook payload
$body = "Body=$([uri]::EscapeDataString($message))&From=$([uri]::EscapeDataString($phone))"

try {
    # Send to your webhook
    $response = Invoke-WebRequest -Uri "http://localhost:3000/webhooks/sms" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "✅ Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "🤖 AI Response:" -ForegroundColor Cyan
    
    # Extract message from TwiML
    if ($response.Content -match '<Message[^>]*>(.*?)</Message>') {
        $aiMessage = $matches[1]
        Write-Host $aiMessage -ForegroundColor White
    } else {
        Write-Host $response.Content -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🎯 To continue conversation, use this phone number: $phone" -ForegroundColor Green
    Write-Host "💡 To check database, look for user with phone: $phone" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "💡 Make sure server is running: npm start" -ForegroundColor Yellow
} 