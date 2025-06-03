# BrainSync Pro Backend 🧠💙

**ADHD-friendly choice empowerment system** - Built with love, understanding, and zero guilt/shame.

## 🎯 What We Built Together

We successfully **replaced all n8n workflows** with a clean, maintainable Node.js backend that:

- ✅ **Collects data** from Google Calendar, weather, and Habitica
- ✅ **Generates AI insights** using Anthropic's Claude 
- ✅ **Sends gentle choice prompts** via SMS
- ✅ **Creates ADHD-friendly reports** via email
- ✅ **Tracks choice patterns** and celebrates decisions
- ✅ **Runs on schedule** with reliable background jobs

## 🏗️ Architecture

```
BrainSync Pro Backend
├── src/
│   ├── services/
│   │   ├── dataCollector.js     # Replaces n8n data collection workflows
│   │   └── aiAnalyzer.js        # Replaces n8n AI analysis workflows
│   ├── utils/
│   │   ├── database.js          # Clean Supabase abstraction
│   │   └── logger.js            # ADHD-friendly logging
│   ├── routes/
│   │   ├── health.js            # System monitoring
│   │   ├── data.js              # Data collection endpoints
│   │   ├── analysis.js          # AI analysis endpoints
│   │   ├── choices.js           # Choice prompt endpoints
│   │   └── webhooks.js          # SMS/email webhooks
│   ├── scheduler.js             # Background jobs (replaces n8n cron)
│   └── server.js                # Express server
├── test.js                      # Test script
└── package.json                 # Dependencies
```

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Setup**
Copy `env.example` to `.env` and fill in your API keys:

```bash
cp env.example .env
```

Required environment variables:
```env
# Database
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Data Sources  
GOOGLE_CLIENT_ID=196649894668-hn6880niqr0q00o49p9scuudmc72lqbm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
HABITICA_USER_ID=your_habitica_user_id_here
HABITICA_API_TOKEN=your_habitica_api_token_here
ALARMY_API_KEY=your_alarmy_api_key_here
FOREST_API_KEY=your_forest_api_key_here
HEADSPACE_API_KEY=your_headspace_api_key_here
YNAB_API_KEY=your_ynab_api_key_here

# Communication (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Testing
TEST_USER_ID=8ded07e7-9f3d-4737-a4f7-18fb1d6564c0
```

### 3. **Test the System**
```bash
node test.js
```

### 4. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔗 API Endpoints

### **Health & Status**
- `GET /` - Welcome message
- `GET /health` - System health check
- `GET /health/detailed` - Detailed system information

### **Data Collection** (Replaces n8n data workflows)
- `POST /api/data/collect` - Collect data for specific user
- `POST /api/data/collect-all` - Collect data for all active users
- `GET /api/data/recent/:userId` - Get recent data points
- `POST /api/data/store` - Store custom data point

### **AI Analysis** (Replaces n8n AI workflows)
- `POST /api/analysis/generate` - Generate AI analysis for user
- `POST /api/analysis/generate-all` - Bulk AI analysis for all users  
- `GET /api/analysis/report/:reportId` - Get specific report
- `GET /api/analysis/data/:userId` - Get analysis data structure

### **Choice Prompts**
- `POST /api/choices/prompt` - Send choice prompt to user
- `POST /api/choices/respond` - Record user response

### **Webhooks**
- `POST /webhooks/sms` - Handle SMS responses (Twilio)
- `POST /webhooks/email` - Handle email events
- `POST /webhooks/feedback` - Store user feedback

## 🧪 Testing the System

### **Test Data Collection**
```bash
curl -X POST http://localhost:3000/api/data/collect \
  -H "Content-Type: application/json" \
  -d '{"userId": "8ded07e7-9f3d-4737-a4f7-18fb1d6564c0"}'
```

### **Test AI Analysis**
```bash
curl -X POST http://localhost:3000/api/analysis/generate \
  -H "Content-Type: application/json" \
  -d '{"userId": "8ded07e7-9f3d-4737-a4f7-18fb1d6564c0"}'
```

### **Test Individual Data Sources**
```bash
# Test weather collection
curl -X POST http://localhost:3000/api/data/test/weather \
  -H "Content-Type: application/json" \
  -d '{"userId": "8ded07e7-9f3d-4737-a4f7-18fb1d6564c0"}'

# Test calendar collection  
curl -X POST http://localhost:3000/api/data/test/calendar \
  -H "Content-Type: application/json" \
  -d '{"userId": "8ded07e7-9f3d-4737-a4f7-18fb1d6564c0"}'
```

## ⏰ Background Jobs (Replaces n8n Cron)

The scheduler automatically runs these jobs:

- **Data Collection**: Every 30 minutes (8 AM - 10 PM)
- **AI Analysis**: Daily at 6 AM  
- **Choice Prompts**: Every 15 minutes (9 AM - 9 PM)
- **Weekly Reports**: Sundays at 8 AM
- **Health Checks**: Every 5 minutes

### **Manual Job Execution**
```javascript
const { Scheduler } = require('./src/scheduler');

// Run specific job manually
await Scheduler.runJob('data-collection');
await Scheduler.runJob('ai-analysis');
await Scheduler.runJob('choice-prompts');
```

## 🧠 ADHD Philosophy

This system is built with deep understanding of ADHD brains:

### **Core Principles**
- **Choice Empowerment** over forced productivity
- **Gentle understanding** instead of guilt/shame
- **Conscious decision-making** celebration
- **Energy management** over time management
- **Self-awareness** as the ultimate goal

### **Sample AI Output**
```
🌅 Morning Energy Check
Hey! 🧠💙 Your brain is online and thinking about the day ahead - that's already a win!

🎯 Gentle Opportunities 
Some options for today (if you're feeling it):
• Honor whatever energy level you're at right now
• Maybe tackle one small thing that feels doable  
• Or just focus on existing - that's valid too!

💖 Choice Celebration
You're here, reading this message, which means you're actively choosing to think about your day. That's self-awareness in action!
```

## 🔗 App Integrations

BrainSync Pro connects with your favorite apps to create a complete picture of your ADHD patterns, celebrating every choice and building self-awareness:

### **Primary Data Sources**

**📅 Google Calendar**
- Scheduling patterns and energy alignment
- Meeting conflicts vs. flow states
- Time blocking effectiveness
- *Choice prompts*: "Meeting in 15 min but you're in flow - keep going, quick transition, or 5 more minutes?"

**🎮 Habitica** 
- Habit streaks and reward patterns
- Task completion vs. energy levels
- Daily/weekly consistency tracking
- *Email insights*: "Your 5-day habit streak shows amazing consistency - your brain is building those neural pathways!"

**⏰ Alarmy (Sleep & Wake-up)**
- Sleep quality and pattern analysis
- Wake-up mission preferences (math, photo, shake, etc.)
- Snore tracking and sleep disruption patterns
- Morning activation success rates
- *Choice prompts*: "Alarmy shows you do better with 7am wake-ups when you sleep by 11pm. It's 10:30 - wind down now or 15 more minutes?"

**🌳 Forest (Focus & Productivity)**
- Focus session lengths and success rates
- Distraction patterns and phone usage
- Deep work vs. scattered attention tracking
- Social productivity session data
- *Choice prompts*: "Forest shows you're 20 minutes into focus but there's a meeting request - keep growing your tree or mindful transition?"

**🧘 Headspace (Meditation & Emotional Regulation)**
- Meditation session frequency and duration preferences  
- Stress pattern recognition and intervention timing
- Sleep story usage and effectiveness
- Emotional regulation technique success rates
- *Choice prompts*: "Calendar shows back-to-back meetings and Headspace data suggests you do better with breathing breaks - 3-minute session or power through?"

**💰 YNAB (Budgeting & Financial Planning)**
- Budget category status and goal progress (user-entered data only)
- Weekly/monthly financial check-ins (opt-in)
- Savings goal achievements and milestones
- Budget awareness building (no behavioral tracking)
- *Choice prompts*: "YNAB shows you hit your savings goal this week - celebrate mindfully, add extra, or just enjoy the awareness?"

**🌤️ OpenWeather**
- Weather impact on mood and energy
- Seasonal affective patterns  
- Outdoor vs. indoor activity correlation
- *Daily insights*: "Sunny and 72°F today - your data shows this weather boosts your focus sessions!"

### **Expansion Sources**
- **💍 Oura Ring**: Sleep stages, recovery metrics, readiness scores
- **🍎 Apple Health / 📱 Samsung Health**: Activity, heart rate, wellness trends
- **👟 Nike Run Club**: Exercise patterns, motivation cycles, endorphin timing
- **🎵 Spotify**: Music mood analysis, productivity soundtrack patterns
- **⏰ RescueTime**: Digital wellness, app usage patterns, distraction triggers
- **✅ Todoist**: Task management styles, completion patterns, energy alignment
- **📝 Notion**: Note-taking habits, knowledge organization, idea capture patterns
- **💬 Slack**: Communication energy, meeting fatigue, collaboration patterns

### **How We Use Your Data**
- **Morning Energy Checks**: Combine sleep data (Alarmy) + weather + calendar to predict your energy levels
- **Flow State Protection**: Use Forest focus sessions + calendar conflicts to offer choice prompts
- **Emotional Regulation**: Headspace meditation patterns + stress triggers to suggest breathing breaks at optimal times
- **Financial Awareness**: YNAB spending patterns + impulse purchase detection to offer mindful money choices
- **Pattern Recognition**: Correlate sleep quality (Alarmy) with focus success (Forest) and habit consistency (Habitica)
- **Gentle Nudges**: Send timely choice prompts based on your actual patterns, not generic advice
- **Choice Celebration**: Highlight when you chose self-care over productivity pressure using real data examples

*Every data point becomes a celebration of your self-awareness journey - no judgment, just understanding.*

## 🚀 Deployment Options

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Railway**
```bash
railway login
railway init
railway up
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logs

### **Health Checks**
- `GET /health` - Basic health
- `GET /health/ready` - Kubernetes readiness probe
- `GET /health/alive` - Kubernetes liveness probe

### **Logging**
All logs include ADHD-friendly emoji indicators:
- 🔄 Data collection
- 🤖 AI analysis  
- 🎯 Choice prompts
- 📧 Email reports
- ⚠️ Warnings
- ❌ Errors

## 🔒 Security Features

- **Rate limiting** (100 requests per 15 minutes)
- **CORS protection** 
- **Helmet.js security headers**
- **Environment variable validation**
- **Error handling** without data leaks

## 🆚 n8n vs BrainSync Pro Backend

| Feature | n8n | BrainSync Pro |
|---------|-----|---------------|
| **Debugging** | Limited visibility | Full console logs |
| **Error Handling** | Node-specific issues | Graceful degradation |
| **Performance** | Vendor limitations | Direct control |
| **Cost** | n8n Cloud fees | Run anywhere |
| **Customization** | UI limitations | Full code control |
| **Testing** | Manual testing | Automated tests |
| **Deployment** | Vendor lock-in | Any platform |

## 🤝 What We Accomplished

### **From n8n Pain Points**
- ❌ Parallel execution bugs (v1.94.1)
- ❌ Complex node debugging
- ❌ Vendor-specific limitations
- ❌ Limited error visibility

### **To Clean Architecture**
- ✅ Reliable sequential execution
- ✅ Full debugging control
- ✅ Platform independence 
- ✅ Complete error transparency

## 🎉 Next Steps

1. **Copy your API keys** from n8n to `.env`
2. **Run the test script** to validate everything works
3. **Start the server** and test the endpoints
4. **Deploy to your preferred platform**
5. **Deactivate the n8n workflows**

## 💌 ADHD-Friendly Notes

- **It's okay if setup takes time** - ADHD brains work differently
- **Each step is a choice** - celebrate completing any part
- **Ask questions** - understanding is more important than speed
- **Take breaks** - hyperfocus is real, but so is burnout
- **Progress over perfection** - every step forward counts

---

**Built with understanding for ADHD minds 🧠💙**

*Remember: Every moment of self-awareness counts. You're doing great!* 