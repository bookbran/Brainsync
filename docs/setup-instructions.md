# 🚀 BrainSync Pro - Account Setup Instructions

**EXECUTE THESE STEPS IN ORDER** - Your Technical Lead (Claude) has determined this sequence for optimal dependency management.

## 📋 Setup Checklist

### ✅ Phase 1: Core Infrastructure (Do First)

#### 1. Supabase (Database) - **HIGHEST PRIORITY**
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Create account with GitHub
- [ ] Create new project: "brainsync-pro"
- [ ] Region: Choose closest to your location
- [ ] Save the following from Settings > API:
  - `SUPABASE_URL` (Project URL)
  - `SUPABASE_ANON_KEY` (anon/public key) 
  - `SUPABASE_SERVICE_ROLE_KEY` (service_role/secret key)
- [ ] Run the SQL schema from `/database/schema.sql` in the SQL Editor

#### 2. N8N Cloud (Workflow Engine) - **CRITICAL PATH**
- [ ] Go to [n8n.cloud](https://n8n.cloud)
- [ ] Start free trial (we'll upgrade to $20/month plan)
- [ ] Create workspace: "brainsync-pro"
- [ ] Save your instance URL (e.g., `https://yourname.app.n8n.cloud`)
- [ ] Generate API key from Settings > API Keys
- [ ] Save `N8N_API_KEY` and `N8N_BASE_URL`

#### 3. Anthropic (Claude API) - **AI ENGINE**
- [ ] Go to [console.anthropic.com](https://console.anthropic.com)
- [ ] Create account and verify
- [ ] Add payment method (required for production use)
- [ ] Generate API key
- [ ] Save `ANTHROPIC_API_KEY`
- [ ] Set usage limits: $50/month initially

### ✅ Phase 2: Integration APIs

#### 4. Google Cloud Console (Calendar API)
- [ ] Go to [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create new project: "brainsync-pro"
- [ ] Enable Calendar API in Library
- [ ] Create OAuth 2.0 credentials:
  - Application type: Web application
  - Authorized domains: Add your domain
  - Redirect URIs: Add N8N callback URLs
- [ ] Save `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

#### 5. OpenWeatherMap (Weather Data)
- [ ] Go to [openweathermap.org/api](https://openweathermap.org/api)
- [ ] Sign up for free account
- [ ] Subscribe to "Current Weather Data" (free tier)
- [ ] Generate API key
- [ ] Save `OPENWEATHERMAP_API_KEY`

#### 6. SendGrid (Email Delivery)
- [ ] Go to [sendgrid.com](https://sendgrid.com)
- [ ] Create account (free tier: 100 emails/day)
- [ ] Complete sender authentication
- [ ] Create API key with full access
- [ ] Save `SENDGRID_API_KEY`
- [ ] Set up domain authentication (optional for MVP)

### ✅ Phase 3: User Accounts (For Testing)

#### 7. Habitica (Habit Tracking Integration)
- [ ] Go to [habitica.com](https://habitica.com)
- [ ] Create personal account for testing
- [ ] Go to Settings > API
- [ ] Save `HABITICA_API_USER` (User ID) and `HABITICA_API_TOKEN`

#### 8. Create Your Test Google Account
- [ ] Use existing Google account or create test account
- [ ] Enable Google Calendar
- [ ] Add some test events to calendar
- [ ] This will be our integration test account

## 🔧 Configuration Setup

### Create Environment File
1. Copy `config/api-keys-template.env` to `.env`
2. Fill in all the API keys you just collected
3. **NEVER commit the .env file to git**

### Verify Setup
After completing all accounts:
- [ ] All API keys collected and saved in `.env`
- [ ] Supabase database schema deployed successfully
- [ ] N8N workspace accessible and API key working
- [ ] Google Calendar API enabled and OAuth configured
- [ ] Test credentials work for Habitica and weather APIs

## 🚨 Security Notes
- **Keep all API keys secret** - never share in chat, email, or code
- Use strong passwords and enable 2FA where available
- Some services require payment methods even for free tiers
- Monitor usage to avoid unexpected charges

## 📞 When You're Done
Message Claude: "All accounts set up, API keys saved. Ready for workflow development."

Include any issues or errors you encountered during setup.

---

**Estimated Time:** 2-3 hours  
**Total Cost:** ~$25/month for all services combined  
**Next Phase:** N8N workflow development and API integration testing 