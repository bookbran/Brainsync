# 📋 BrainSync Pro - Product Requirements Document (PRD)

## 🧠 **ADHD-Friendly Development Notes**
**⚠️ IMPORTANT: Always ask Daniel only ONE question at a time - he has ADHD too!**

### 📁 **Key Files to Reference (Stay In-Scope)**
- **Database Schema**: `docs/database-schema.md` - Data structure 
- **Roadmap**: `docs/roadmap.md` - Timeline and priorities
- **Orchestration**: `adhd_orchestrator_docs.md` - System architecture
- **Backend Code**: `src/` directory - Current implementation
- **Landing Strategy**: `docs/adhd-landing-page-strategy.md` - User acquisition

### 🎯 **Scope Boundaries**
- ✅ **In-Scope**: ADHD-first design, choice empowerment, gentle guidance, habit tracker integration
- ❌ **Out-of-Scope**: Generic productivity tools, harsh optimization, neurotypical-first features

### 🔬 **Research Focus Areas**
- **ADHD Data Sources**: Samsung Sleep, Oura Ring, Apple Fitness, Nike Run Club, etc.
- **Popular Habit Trackers**: Habitica (implemented), Focus Bear, Streaks, Productive
- **Integration Priority**: Connect to tools ADHD people already use and love

---

## 🎯 **Product Vision & Mission**

*Content will be added based on Daniel's input...* 

> ⚠️ **ADHD-Friendly Note**: This document contains many details. Ask me ONE question at a time for clarity.
> 📁 **Key Project Files**: `docs/database-schema.md`, `docs/roadmap.md`, `src/services/`, `brainsync-landing/`

## Core Product Vision

BrainSync Pro is an ADHD-friendly AI life orchestration system that **celebrates conscious choice-making** rather than demanding productivity compliance. The system connects scattered apps to provide gentle, understanding guidance via daily emails and real-time text message choice prompts.

## Key Principles

1. **Choice Empowerment Over Productivity Pressure**
2. **Gentle Guidance Without Guilt**
3. **ADHD-Native Understanding**
4. **Celebration of ALL Decisions** (including "unproductive" ones)

## Core Features

### 1. Daily Gentle Email Guidance
- **Delivery**: One email per morning, never overwhelming
- **Content**: Personalized insights based on calendar, habits, weather, choice patterns
- **Tone**: Understanding, celebratory, zero pressure
- **Components**:
  - Morning energy check
  - Gentle opportunities (not demands)
  - Choice celebration from previous day
  - Weekly progress tracking with choice metrics
  - Visual progress charts showing conscious choice journey

### 2. Real-Time Choice Text Prompts
- **Delivery Method**: SMS text messages (no app required)
- **Interaction**: Users reply with numbers 1, 2, or 3
- **Timing**: Smart detection of transition moments (e.g., meeting conflicts with flow state)
- **Response Options**: Always 3 choices honoring different approaches
- **Example Choices**:
  - 1️⃣ Keep flowing (I'll reschedule the meeting for you)
  - 2️⃣ Transition now (gentle switch mode)
  - 3️⃣ Compromise (5 more minutes then switch)

### 3. ADHD-Aware Nudging System
- **Initial Prompt**: Gentle text with 3 numbered choices
- **No Response Protocol**: Wait 5 minutes, then send understanding follow-up
- **Nudge Tone**: "Hey, I don't want to bother you like this, but what's your choice? 🤗 I know you saw my text (ADHD brain, right?). No judgment - just reply when you can."
- **Final Fallback**: If still no response, assume choice that honors current state
- **Philosophy**: Acknowledge ADHD procrastination tendencies without shame

### 4. Data Integration Hub
**Primary Sources**:
- Google Calendar (events & scheduling)
- Habitica (habit tracking & rewards)
- Alarmy (sleep patterns, wake-up habits & snore analysis)
- Forest (focus sessions, productivity patterns & distraction management)
- Headspace (meditation sessions, emotional regulation & stress management)
- YNAB (budget categories, goal progress & user-initiated financial check-ins - NO behavioral tracking)
- OpenWeatherMap (weather & mood patterns)

**Expansion Sources**:
- Oura Ring (sleep & recovery data)
- Apple Health & Samsung Health (activity & wellness)
- Nike Run Club (running & motivation)
- Spotify (music & mood analysis)
- RescueTime (digital wellness tracking)
- Todoist (task management)
- Notion (notes & knowledge base)
- Slack (team communication patterns)

### 5. Progress Tracking & Visualization
- **Conscious Choice Metrics**: Track decision-making moments, not task completion
- **Weekly Progress Charts**: Visual bar charts showing choice awareness growth
- **ADHD-Realistic Patterns**: Acknowledge up and down weeks as normal
- **Progress Insights**: Gentle analysis of choice-making patterns
- **Celebration Focus**: Highlight growth in self-awareness, not productivity

## Technical Implementation

### Choice Prompt System
```
User Trigger: Smart calendar conflict detection
↓
Text Message: "Brain check! Meeting in 15 min but you're in flow. Reply 1, 2, or 3:"
↓
User Response: Types "2" and sends
↓
AI Response: Gentle confirmation and action execution
↓
No Response Backup: Gentle nudge after 5 minutes
↓
Final Fallback: Assume choice honoring current state
```

### Alarmy & Forest Integration Examples

**Sleep-Based Choice Prompts (Alarmy)**:
- Late evening screen time detection: "Your Alarmy shows you wake up better with 7am alarms when you sleep by 11pm. It's 10:30 - wind down now, 15 more minutes, or night owl mode?"
- Morning activation choices: "Alarmy detected you snoozed 3 times. Brain needs gentle activation? Math mission, photo mission, or easy wake-up today?"
- Sleep quality insights: "Your snore analysis shows restless sleep when you have caffeine after 3pm. Coffee decision coming up - what feels right?"

**Focus-Based Choice Prompts (Forest)**:
- Flow state protection: "Forest shows you're 20 minutes into deep focus but there's a meeting request. Keep growing your tree, take a quick break, or end session mindfully?"
- Energy-based session planning: "Your recent Forest data shows 25-minute sessions work better than 45-minute ones on low-energy days. Today's focus block - honor your pattern or try longer?"
- Distraction management: "Forest tree died from phone checking. No judgment! Reset with shorter session, take a real break, or try app-blocking mode?"

**Combined Data Insights**:
- Sleep + Focus correlation: "Alarmy shows great sleep last night, Forest data suggests this is when you do your best 45-minute sessions. Today feels like a deep work day?"
- Energy pattern recognition: "Alarmy sleep quality + Forest session success rates suggest you're a morning person. Reschedule afternoon meeting to honor your peak hours?"

**Emotional Regulation Choice Prompts (Headspace)**:
- Stress detection: "Calendar shows back-to-back meetings and Headspace data suggests you do better with breathing breaks. 3-minute session, walking meditation, or power through?"
- Overwhelm prevention: "Your stress patterns suggest this is a good time for mindfulness. Headspace shows 5-minute anxiety sessions work best for you - try one now?"
- Evening wind-down: "Headspace shows sleep meditations help you transition from work mode. Tonight's choice: 10-minute sleep story, breathing exercise, or skip and doom-scroll?"

**Financial Awareness Choice Prompts (YNAB)**:
- Weekly budget celebration: "YNAB shows you hit your savings goal this week - how do you want to celebrate this win? Treat yourself mindfully, add extra to savings, or just celebrate the awareness?"
- Monthly check-in: "YNAB monthly review time! Your budget categories look balanced - feeling good about your financial awareness journey?"
- Goal progress support: "Your YNAB emergency fund goal is 75% complete - that's amazing progress! Keep the momentum or adjust the timeline?"

### Data Flow
```
External APIs → BrainSync AI Analysis → Choice Opportunity Detection → SMS Prompt
                                    → Daily Email Generation
                                    → Progress Tracking Update
```

## User Experience Principles

### ADHD-First Design
- **Minimal Cognitive Load**: Simple number responses, not complex interfaces
- **Procrastination-Aware**: Gentle nudging system that understands ADHD delays
- **Choice Celebration**: Every decision honored as conscious choice-making
- **No Guilt Messaging**: Understanding tone that normalizes ADHD struggles
- **Visual Progress**: Charts that show growth in self-awareness over time

### Message Tone Examples
**Choice Prompts**: Conversational, understanding, no pressure
**Nudges**: "Hey, I don't want to bother you like this..."
**Responses**: Celebrating the choice made, explaining the action taken
**Progress**: Acknowledging ups and downs as normal ADHD patterns

## Success Metrics
- **Choice Response Rate**: Percentage of prompts receiving user responses
- **Conscious Choice Growth**: Increase in recognized decision moments over time
- **User Retention**: Daily email engagement and text response consistency
- **Choice Celebration**: User feedback on feeling understood vs. pressured

## Future Enhancements
- WhatsApp Business API integration for interactive buttons
- Voice response option for hands-free choice making
- Family/partner integration for shared choice awareness
- Advanced pattern recognition for personalized choice timing

---
*Built with 💙 for ADHD brains who deserve gentle, understanding technology* 