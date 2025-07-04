# 🧪 Test Intelligent Conversation Engine
# Interactive PowerShell script for testing the ADHD-friendly prioritization system

param(
    [string]$Message = "Hey goodberry, I really need help getting my life organized. I feel so scattered lately",
    [string]$Phone = "+15551234567",
    [string]$ServerUrl = "http://localhost:3000"
)

Write-Host "🎯 Testing Intelligent Conversation Engine" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 Phone: $Phone" -ForegroundColor Green
Write-Host "💬 Message: $Message" -ForegroundColor Green
Write-Host ""

try {
    $body = "From=" + [uri]::EscapeDataString($Phone) + "&Body=" + [uri]::EscapeDataString($Message)
    
    $response = Invoke-WebRequest -Uri "$ServerUrl/webhooks/sms" -Method POST -Headers @{"Content-Type"="application/x-www-form-urlencoded"} -Body $body -TimeoutSec 30
    
    Write-Host "✅ Response received (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host ""
    Write-Host "🤖 Goodberry says:" -ForegroundColor Magenta
    Write-Host "-------------------" -ForegroundColor Yellow
    
    # Just show the raw response content
    Write-Host $response.Content -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎉 Test completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "💡 To test with a different message:" -ForegroundColor Yellow
Write-Host ".\test-conversation.ps1 -Message 'Your message here'" -ForegroundColor Cyan 