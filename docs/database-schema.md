# 🗄️ goodberry - Database Schema Documentation
## Calendar First - ADHD Brain-Friendly Data Structure

## 🧠 **ADHD-Friendly Development Notes**
**⚠️ IMPORTANT: Always ask Daniel only ONE question at a time - he has ADHD too!**

### 📁 **Key Files to Reference (Stay In-Scope)**
- **Product Requirements**: `docs/product-requirements.md` - Calendar First features
- **Roadmap**: `docs/roadmap.md` - Implementation timeline
- **Backend Code**: `src/` directory - Current implementation
- **Landing Page**: `goodberry-landing/src/components/calendar/CalendarHeroSection.tsx` - Live demo
- **🆕 Database Schema Script**: `goodberry-schema.sql` - Complete SQL setup for Enhanced Conversation Engine (Step 3)

### 🎯 **Scope Boundaries**
- ✅ **In-Scope**: Conversational calendar data, mental health gaps, brain trap patterns, ADHD energy tracking
- ❌ **Out-of-Scope**: External app integrations, generic productivity metrics, neurotypical calendar assumptions

---

## 📧 **Pre-Launch Waitlist System**

### **Implementation Status**: ✅ LIVE - Full waitlist system with feedback collection

**Purpose**: Capture pre-launch interest with research/feedback engagement tracking and duplicate prevention while maintaining collaborative tone and personalized user experience.

### `waitlist`
```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255), -- First name only for conversational feel
  phone VARCHAR(50),
  sms_consent BOOLEAN DEFAULT FALSE,
  feedback_interest INTEGER DEFAULT 1 CHECK (feedback_interest >= 1 AND feedback_interest <= 5),
  source VARCHAR(100) DEFAULT 'landing_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX idx_waitlist_feedback_interest ON waitlist(feedback_interest);
CREATE INDEX idx_waitlist_source ON waitlist(source);

-- Comments for documentation
COMMENT ON COLUMN waitlist.feedback_interest IS 'Research engagement level: 1="dont contact about anything except launch" to 5="lets chat!"';
COMMENT ON COLUMN waitlist.source IS 'Signup source tracking (calendar_landing, main_page, etc.)';
```

### `app_wishlist`
```sql
CREATE TABLE app_wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  wishlist_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes  
CREATE INDEX idx_app_wishlist_email ON app_wishlist(email);
CREATE INDEX idx_app_wishlist_created_at ON app_wishlist(created_at DESC);

COMMENT ON TABLE app_wishlist IS 'User feedback and feature requests for product development';
```

### **Waitlist System Features**

#### **Research/Feedback Interest Slider**
- **Scale**: 1-5 with dynamic descriptions
- **Level 1**: "Don't contact me about anything other than to let me know it's ready"  
- **Level 5**: "Let's chat! I want to help shape this thing"
- **Default**: 1 (least intrusive)
- **Database Field**: `feedback_interest` with CHECK constraint (1-5)

#### **Duplicate Email Prevention**
- **Method**: Unique constraint on email field + normalized checking (lowercase/trim)
- **User Experience**: Friendly message "We already have you on the waitlist!"
- **Backend Function**: `email_exists()` helper function for real-time checking

#### **Personalized HP Animation**  
- **Experience**: "[FirstName] has been redeemed! +1 HP! Thank goodness for goodberry! 🫐"
- **Duration**: 3-second celebration animation post-signup
- **Storage**: First name captured for personalization (changed from full name)

#### **Admin Testing System**
- **Test Emails**: `daniel.i.hahn@gmail.com`, `dan@masteringdecisions.com`, `dan@aportlandcareer.com`
- **Behavior**: Bypass database insertion but show full post-signup experience
- **Purpose**: Allow testing without database pollution
- **Logging**: Console indicators for test mode

### **Analytics Views**

#### `waitlist_analytics`
```sql
CREATE VIEW waitlist_analytics AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE sms_consent = true) as sms_opted_in,
    COUNT(*) FILTER (WHERE phone IS NOT NULL) as with_phone,
    ROUND(AVG(feedback_interest), 2) as avg_feedback_interest,
    COUNT(*) FILTER (WHERE feedback_interest >= 4) as high_engagement_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as signups_last_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as signups_last_7d,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as signups_last_30d
FROM waitlist;
```

#### `feedback_interest_breakdown`
```sql
CREATE VIEW feedback_interest_breakdown AS
SELECT 
    feedback_interest,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM waitlist), 0), 2) as percentage
FROM waitlist
GROUP BY feedback_interest
ORDER BY feedback_interest;
```

#### `signup_sources`
```sql
CREATE VIEW signup_sources AS
SELECT 
    source,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM waitlist), 0), 2) as percentage,
    MAX(created_at) as last_signup
FROM waitlist
GROUP BY source
ORDER BY count DESC;
```

### **Helper Functions**

#### `get_waitlist_count()`
```sql
CREATE FUNCTION get_waitlist_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::INTEGER FROM waitlist;
$$;
```

#### `email_exists(check_email TEXT)`
```sql
CREATE FUNCTION email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(SELECT 1 FROM waitlist WHERE LOWER(email) = LOWER(check_email));
$$;
```

### **Row Level Security**
```sql
-- Enable RLS on waitlist tables
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_wishlist ENABLE ROW LEVEL SECURITY;

-- Public access policies for signup forms
CREATE POLICY "Enable insert for anonymous users" ON waitlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users" ON waitlist
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for anonymous users" ON app_wishlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for anonymous users" ON app_wishlist
    FOR SELECT USING (true);
```

### **Integration with Main System**
The waitlist system will transition users into the main ADHD-focused calendar system upon launch. Key connections:

- **Email to User Migration**: Waitlist emails become initial user accounts
- **Feedback Interest Tracking**: High-engagement users (4-5) prioritized for beta testing
- **Research Participation**: Users with feedback_interest >= 4 contacted for user research
- **Source Attribution**: Track which landing page/campaign drove highest-quality signups
- **Onboarding Preparation**: Wishlist content helps customize initial onboarding conversation

---

## 📊 **Calendar First Database Schema**

### **Implementation Status**: 🔄 UPDATING for Calendar First Approach

---

## 👤 **Core User & Profile Tables**

### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- ADHD Profile
  adhd_diagnosis BOOLEAN DEFAULT false,
  adhd_medication_times TIME[],
  energy_pattern_type VARCHAR(20) DEFAULT 'unknown', -- 'morning', 'evening', 'variable'
  
  -- Conversation Preferences
  conversation_style VARCHAR(20) DEFAULT 'gentle', -- 'gentle', 'direct', 'playful'
  brain_trap_sensitivity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  
  -- Calendar Preferences
  mental_health_gap_duration INTEGER DEFAULT 120, -- minutes, default 2 hours
  buffer_time_preference INTEGER DEFAULT 15, -- minutes between events
  max_daily_commitments INTEGER DEFAULT 5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `user_energy_patterns`
```sql
CREATE TABLE user_energy_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Energy Tracking
  day_of_week INTEGER, -- 0=Sunday, 6=Saturday
  hour_of_day INTEGER, -- 0-23
  energy_level INTEGER, -- 1-10 scale
  focus_quality INTEGER, -- 1-10 scale
  social_battery INTEGER, -- 1-10 scale
  
  -- Context
  post_exercise BOOLEAN DEFAULT false,
  post_meal BOOLEAN DEFAULT false,
  medication_active BOOLEAN DEFAULT false,
  weather_condition VARCHAR(50),
  
  -- Learning Data
  confidence_score FLOAT DEFAULT 0.5, -- AI confidence in this pattern
  sample_count INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `weather_data`
```sql
CREATE TABLE weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Weather Details
  date DATE NOT NULL,
  location_lat FLOAT,
  location_lng FLOAT,
  location_name VARCHAR(100),
  
  -- Current Conditions
  temperature_high INTEGER, -- Fahrenheit
  temperature_low INTEGER,
  condition VARCHAR(50), -- 'sunny', 'cloudy', 'rainy', 'snowy'
  humidity INTEGER, -- percentage
  wind_speed INTEGER, -- mph
  uv_index INTEGER,
  
  -- ADHD-Relevant Factors
  light_quality VARCHAR(20), -- 'bright', 'dim', 'artificial'
  seasonal_factor FLOAT, -- seasonal affective impact 0-1
  outdoor_suitability INTEGER, -- 1-10 scale
  
  -- External Data
  openweather_data JSONB, -- full API response
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `weather_energy_correlations`
```sql
CREATE TABLE weather_energy_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Correlation Data
  weather_condition VARCHAR(50),
  temperature_range VARCHAR(20), -- 'cold', 'cool', 'warm', 'hot'
  energy_impact FLOAT, -- -1 to 1 (negative = draining, positive = energizing)
  focus_impact FLOAT,
  mood_impact FLOAT,
  
  -- Learning Metrics
  confidence_score FLOAT DEFAULT 0.5,
  sample_count INTEGER DEFAULT 1,
  last_observed DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `calendar_evolution_tracking`
```sql
CREATE TABLE calendar_evolution_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Evolution Phase
  current_month INTEGER DEFAULT 1, -- 1, 2, or 3
  phase_started_date DATE NOT NULL,
  phase_completion_percentage INTEGER DEFAULT 0,
  
  -- Month 1 Metrics (Foundation)
  family_protection_success_rate FLOAT DEFAULT 0.0,
  mental_health_gaps_consistency FLOAT DEFAULT 0.0,
  basic_pattern_recognition_confidence FLOAT DEFAULT 0.0,
  
  -- Month 2 Metrics (Energy Optimization)
  energy_pattern_accuracy FLOAT DEFAULT 0.0,
  buffer_time_effectiveness FLOAT DEFAULT 0.0,
  transition_quality_score FLOAT DEFAULT 0.0,
  
  -- Month 3 Metrics (Full ADHD Flow)
  brain_trap_detection_accuracy FLOAT DEFAULT 0.0,
  predictive_suggestion_success_rate FLOAT DEFAULT 0.0,
  seasonal_adaptation_score FLOAT DEFAULT 0.0,
  
  -- Overall Progress
  user_satisfaction_trend JSONB, -- array of weekly satisfaction scores
  feature_adoption_rate FLOAT DEFAULT 0.0,
  retention_probability FLOAT DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `external_calendar_sync`
```sql
CREATE TABLE external_calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Calendar Provider
  provider VARCHAR(50) NOT NULL, -- 'google', 'outlook', 'apple', 'caldav'
  calendar_id VARCHAR(255) NOT NULL,
  calendar_name VARCHAR(255),
  
  -- Sync Configuration
  sync_enabled BOOLEAN DEFAULT true,
  sync_direction VARCHAR(20) DEFAULT 'bidirectional', -- 'read_only', 'write_only', 'bidirectional'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency_minutes INTEGER DEFAULT 15,
  
  -- Authentication
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Sync Status
  sync_status VARCHAR(20) DEFAULT 'active', -- 'active', 'error', 'disabled'
  last_error TEXT,
  consecutive_error_count INTEGER DEFAULT 0,
  
  -- Integration Settings
  import_existing_events BOOLEAN DEFAULT true,
  export_mental_health_gaps BOOLEAN DEFAULT false,
  event_prefix VARCHAR(50), -- prefix for goodberry-created events
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📅 **Calendar & Event Management**

### `calendar_events`
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Event Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT false,
  
  -- ADHD-Specific Classification
  event_type VARCHAR(50) NOT NULL, -- 'work', 'family', 'self_care', 'social', 'mental_health_gap'
  energy_requirement VARCHAR(20), -- 'low', 'medium', 'high'
  priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'non_negotiable'
  
  -- Protection & Flexibility
  is_protected BOOLEAN DEFAULT false, -- never auto-reschedule
  is_flexible BOOLEAN DEFAULT true, -- can be moved if needed
  is_mental_health_gap BOOLEAN DEFAULT false,
  buffer_before INTEGER DEFAULT 0, -- minutes
  buffer_after INTEGER DEFAULT 0, -- minutes
  
  -- AI Generation Context
  created_via VARCHAR(50) DEFAULT 'conversation', -- 'conversation', 'manual', 'optimization'
  conversation_id UUID, -- links to conversation that created this
  ai_confidence FLOAT DEFAULT 0.8,
  
  -- External Integration
  google_calendar_id VARCHAR(255),
  external_source VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `mental_health_gaps`
```sql
CREATE TABLE mental_health_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  calendar_event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  
  -- Gap Details
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Protection Status
  was_violated BOOLEAN DEFAULT false, -- was something scheduled over this?
  violation_reason TEXT,
  user_approved_override BOOLEAN DEFAULT false,
  
  -- Effectiveness Tracking
  user_rating INTEGER, -- 1-10, how helpful was this gap?
  actual_usage VARCHAR(100), -- what did user actually do?
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 💬 **Conversational AI & Planning**

### `conversations`
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Conversation Classification
  conversation_type VARCHAR(50) NOT NULL, -- 'onboarding', 'sunday_planning', 'brain_trap', 'optimization', 'general'
  session_goal TEXT,
  
  -- Planning Context
  planning_week_start DATE, -- for Sunday planning sessions
  planning_week_end DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  completion_quality VARCHAR(20), -- 'excellent', 'good', 'partial', 'poor'
  
  -- Outcomes
  events_created INTEGER DEFAULT 0,
  patterns_identified INTEGER DEFAULT 0,
  choices_offered INTEGER DEFAULT 0,
  user_satisfaction INTEGER, -- 1-10 rating
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `conversation_messages`
```sql
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message Details
  role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  message_order INTEGER NOT NULL,
  
  -- AI Context
  intent_detected VARCHAR(100),
  entities_extracted JSONB, -- structured data extracted from message
  calendar_actions JSONB, -- any calendar events/changes this message triggered
  
  -- Processing
  processing_time_ms INTEGER,
  ai_model_used VARCHAR(50),
  confidence_score FLOAT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `sunday_planning_sessions`
```sql
CREATE TABLE sunday_planning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  -- Planning Period
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  
  -- Session Outcomes
  wins_celebrated TEXT[],
  patterns_identified TEXT[],
  goals_set TEXT[],
  events_planned INTEGER DEFAULT 0,
  mental_health_gaps_scheduled INTEGER DEFAULT 0,
  
  -- Quality Metrics
  session_duration_minutes INTEGER,
  user_satisfaction INTEGER, -- 1-10
  completion_percentage INTEGER, -- how much of planning was completed
  
  -- Follow-up
  monday_email_sent BOOLEAN DEFAULT false,
  monday_email_sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧠 **Brain Trap Detection & Choice Framework**

### `brain_trap_detections`
```sql
CREATE TABLE brain_trap_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Detection Details
  trap_type VARCHAR(50) NOT NULL, -- 'late_night_spiral', 'procrastination_loop', 'hyperfocus_overrun', 'social_media_doom_scroll'
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
  confidence_score FLOAT NOT NULL,
  
  -- Context
  trigger_event_id UUID REFERENCES calendar_events(id), -- what upcoming event triggered this?
  current_activity TEXT,
  time_until_next_commitment INTEGER, -- minutes
  user_energy_level INTEGER, -- 1-10 if known
  
  -- Intervention
  intervention_sent BOOLEAN DEFAULT false,
  intervention_type VARCHAR(50), -- 'gentle_nudge', 'choice_framework', 'emergency_support'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `choice_prompts`
```sql
CREATE TABLE choice_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  brain_trap_detection_id UUID REFERENCES brain_trap_detections(id),
  
  -- Prompt Details
  prompt_text TEXT NOT NULL,
  choice_options JSONB NOT NULL, -- array of 3 choice objects with emoji, text, description
  
  -- Context
  situation_description TEXT,
  energy_level_context VARCHAR(20),
  upcoming_commitments JSONB, -- relevant calendar events
  
  -- Delivery
  sent_via VARCHAR(20) DEFAULT 'app', -- 'app', 'sms', 'email', 'push'
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Response
  user_choice_index INTEGER, -- 0, 1, or 2 for which option they chose
  response_time_minutes INTEGER,
  user_response_text TEXT, -- if they replied with custom text
  
  -- Follow-up
  choice_celebrated BOOLEAN DEFAULT false,
  outcome_tracked BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🧠 **Persistent AI Memory System**

### `user_memory_context`
```sql
CREATE TABLE user_memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Memory Categories
  context_type VARCHAR(50) NOT NULL, -- 'core_identity', 'preferences', 'patterns', 'recent_context', 'calendar_habits'
  context_key VARCHAR(100) NOT NULL, -- 'communication_style', 'henry_priority', 'post_workout_energy', 'sunday_planning_style'
  
  -- Memory Content
  summary TEXT NOT NULL, -- human-readable summary for AI context injection
  structured_data JSONB, -- machine-readable details and confidence scores
  confidence_score FLOAT DEFAULT 1.0, -- how certain we are about this insight (0.0-1.0)
  
  -- Source Tracking
  learned_from_conversation_ids UUID[], -- which conversations contributed to this insight
  first_observed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_confirmed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  observation_count INTEGER DEFAULT 1,
  
  -- Context Usage & Priority
  retrieval_priority INTEGER DEFAULT 5, -- 1-10, importance for context injection
  is_active BOOLEAN DEFAULT true,
  invalidated_by TEXT, -- reason if this memory becomes outdated
  
  -- Memory Evolution
  previous_version_id UUID, -- track how insights evolve over time
  contradiction_count INTEGER DEFAULT 0, -- times this was contradicted
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, context_type, context_key)
);
```

### `conversation_outcomes`
```sql
CREATE TABLE conversation_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- What User Explicitly Shared
  explicit_feedback JSONB, -- what user told us about how things went
  wins_shared TEXT[], -- successes user mentioned
  struggles_shared TEXT[], -- challenges user reported
  preferences_revealed TEXT[], -- new preferences discovered
  
  -- Observable Pattern Data
  scheduling_choices JSONB, -- what times/types they chose
  pattern_confirmations TEXT[], -- patterns that were reinforced
  pattern_contradictions TEXT[], -- patterns that were challenged
  
  -- AI Learning Extraction
  insights_extracted JSONB, -- structured insights for memory system
  memory_updates_made INTEGER DEFAULT 0, -- how many memory contexts were updated
  
  -- Quality Metrics
  extraction_confidence FLOAT, -- AI confidence in insights extracted
  user_satisfaction INTEGER, -- 1-10 if user provided feedback
  follow_through_observable BOOLEAN, -- did user follow through on plans made?
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `memory_context_evolution`
```sql
CREATE TABLE memory_context_evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_memory_context_id UUID REFERENCES user_memory_context(id) ON DELETE CASCADE,
  
  -- Change Details
  change_type VARCHAR(50) NOT NULL, -- 'initial_learn', 'confirmation', 'refinement', 'contradiction', 'invalidation'
  previous_summary TEXT,
  new_summary TEXT,
  confidence_before FLOAT,
  confidence_after FLOAT,
  
  -- Change Source
  triggered_by_conversation_id UUID REFERENCES conversations(id),
  change_reason TEXT,
  supporting_evidence JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `user_foundation_documents`
```sql
CREATE TABLE user_foundation_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Core Foundation from Onboarding
  core_values JSONB NOT NULL, -- extracted from values exploration
  work_personal_allocation JSONB, -- time percentage preferences and reasoning
  priority_hierarchy JSONB, -- ranked priorities with seasonal notes
  family_relationships JSONB, -- key people and their importance
  
  -- ADHD Patterns & Preferences  
  energy_patterns JSONB, -- when they're most/least energetic
  communication_preferences JSONB, -- how they like to interact
  overwhelm_triggers JSONB, -- what causes stress/anxiety
  celebration_styles JSONB, -- how they like wins acknowledged
  
  -- Calendar & Scheduling DNA
  scheduling_preferences JSONB, -- buffer time, meeting styles, etc.
  seasonal_patterns JSONB, -- what changes throughout the year
  non_negotiables JSONB, -- boundaries and must-haves
  
  -- Life Context
  current_life_season TEXT, -- what's their focus right now
  biggest_struggles JSONB, -- recurring challenges they face
  previous_system_failures TEXT[], -- what hasn't worked before
  success_patterns JSONB, -- what has worked well
  
  -- Foundation Quality
  onboarding_conversation_id UUID REFERENCES conversations(id),
  completeness_score FLOAT DEFAULT 0.5, -- how complete this foundation is
  last_major_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  needs_refresh BOOLEAN DEFAULT false, -- flag for periodic updates
  
  -- Evolution Tracking
  version INTEGER DEFAULT 1,
  previous_version_id UUID, -- track foundation evolution
  change_summary TEXT, -- what changed in this version
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, version)
);
```

### `foundation_refresh_sessions`
```sql
CREATE TABLE foundation_refresh_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  foundation_document_id UUID REFERENCES user_foundation_documents(id),
  
  -- Refresh Details
  refresh_type VARCHAR(50) NOT NULL, -- 'quarterly_check_in', 'major_life_change', 'user_requested', 'pattern_contradiction'
  sections_updated TEXT[], -- which parts of foundation changed
  insights_evolved JSONB, -- what insights deepened or changed
  
  -- Conversation Details
  conversation_id UUID REFERENCES conversations(id),
  user_satisfaction INTEGER, -- 1-10 rating of refresh quality
  foundation_accuracy_before INTEGER, -- 1-10 how accurate foundation felt
  foundation_accuracy_after INTEGER, -- 1-10 how accurate it feels now
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `user_success_timeline`
```sql
CREATE TABLE user_success_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Success Categories
  success_type VARCHAR(50) NOT NULL, -- 'scheduling_win', 'life_improvement', 'personal_growth', 'system_adoption', 'breakthrough_moment'
  success_area VARCHAR(50), -- 'calendar_management', 'energy_optimization', 'family_time', 'work_productivity', 'self_awareness'
  
  -- Success Details
  success_title TEXT NOT NULL, -- "Nailed that presentation after post-workout prep"
  user_shared_description TEXT, -- exactly what user told us about the win
  ai_observed_context TEXT, -- what AI noticed about the success
  impact_level INTEGER DEFAULT 5, -- 1-10 significance of this win
  
  -- Conversational Memory
  conversation_context JSONB, -- surrounding conversation where this was shared
  emotional_tone TEXT, -- how user felt sharing this ("excited", "proud", "relieved")
  user_surprise_factor BOOLEAN DEFAULT false, -- did user seem surprised by their own success?
  
  -- Success Patterns
  contributing_factors JSONB, -- what helped make this success happen
  connected_to_foundation BOOLEAN DEFAULT false, -- does this align with their core values/patterns?
  previous_struggle_overcome TEXT, -- what past challenge this represents progress on
  
  -- Reference Timing
  occurred_date TIMESTAMP WITH TIME ZONE, -- when the success actually happened
  shared_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- when user told us about it
  reference_count INTEGER DEFAULT 0, -- how many times AI has referenced this win
  last_referenced TIMESTAMP WITH TIME ZONE,
  
  -- Success Evolution
  builds_on_success_id UUID, -- references another success this builds upon
  milestone_significance TEXT, -- why this success matters in their journey
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `success_reflection_moments`
```sql
CREATE TABLE success_reflection_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  -- Reflection Trigger
  trigger_reason VARCHAR(50) NOT NULL, -- 'struggle_support', 'confidence_boost', 'pattern_reinforcement', 'quarterly_review'
  current_challenge_context TEXT, -- what prompted AI to offer reflection
  
  -- Success References Used
  successes_referenced UUID[], -- which specific wins were mentioned
  timeframe_referenced TEXT, -- "4 months ago" vs "just last month"
  progress_narrative TEXT, -- the story AI told about their growth
  
  -- User Response
  user_response_tone TEXT, -- how user reacted to the reflection
  confidence_boost_rating INTEGER, -- 1-10 how much this seemed to help
  led_to_action BOOLEAN DEFAULT false, -- did this reflection lead to positive action?
  
  -- Effectiveness Tracking
  timing_appropriateness INTEGER, -- 1-10 was this well-timed?
  content_accuracy INTEGER, -- 1-10 did user agree with the reflection?
  emotional_impact INTEGER, -- 1-10 positive emotional response
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📊 **Pattern Learning & Analytics**

### `user_patterns`
```sql
CREATE TABLE user_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Pattern Details
  pattern_type VARCHAR(50) NOT NULL, -- 'energy_cycle', 'choice_preference', 'brain_trap_trigger', 'planning_style'
  pattern_name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Pattern Data
  pattern_data JSONB NOT NULL, -- flexible structure for different pattern types
  confidence_score FLOAT NOT NULL,
  sample_size INTEGER NOT NULL,
  
  -- Validation
  user_confirmed BOOLEAN DEFAULT false,
  effectiveness_rating INTEGER, -- 1-10
  last_validated_at TIMESTAMP WITH TIME ZONE,
  
  -- Application
  is_active BOOLEAN DEFAULT true,
  applied_count INTEGER DEFAULT 0,
  success_rate FLOAT DEFAULT 0.0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `calendar_optimizations`
```sql
CREATE TABLE calendar_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Optimization Run
  optimization_date DATE NOT NULL,
  trigger_reason VARCHAR(100), -- 'user_request', 'automatic_weekly', 'conflict_detected'
  
  -- Changes Made
  events_moved INTEGER DEFAULT 0,
  mental_health_gaps_preserved INTEGER DEFAULT 0,
  buffer_time_added INTEGER DEFAULT 0,
  energy_patterns_applied INTEGER DEFAULT 0,
  
  -- Optimization Rules Applied
  rules_applied JSONB, -- which ADHD-specific rules were used
  conflicts_resolved INTEGER DEFAULT 0,
  
  -- User Feedback
  user_approved BOOLEAN,
  user_rating INTEGER, -- 1-10
  user_feedback TEXT,
  
  -- Effectiveness
  adherence_rate FLOAT, -- how well user stuck to optimized schedule
  satisfaction_score FLOAT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📧 **Communication & Engagement**

### `weekly_emails`
```sql
CREATE TABLE weekly_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sunday_planning_session_id UUID REFERENCES sunday_planning_sessions(id),
  
  -- Email Details
  email_type VARCHAR(20) DEFAULT 'monday_gameplan', -- 'monday_gameplan', 'weekly_summary'
  subject_line VARCHAR(255) NOT NULL,
  email_content TEXT NOT NULL,
  
  -- Content Components
  wins_highlighted TEXT[],
  energy_patterns_summarized TEXT,
  focus_areas TEXT[],
  protected_time_emphasized TEXT[],
  
  -- Delivery
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'failed'
  
  -- Engagement
  opened_at TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,
  user_rating INTEGER, -- 1-10 if they rate the email
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔄 **Indexes for Performance**

```sql
-- User and conversation lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversations_user_type ON conversations(user_id, conversation_type);
CREATE INDEX idx_messages_conversation_order ON conversation_messages(conversation_id, message_order);

-- Calendar event queries
CREATE INDEX idx_calendar_events_user_time ON calendar_events(user_id, start_time);
CREATE INDEX idx_calendar_events_type ON calendar_events(user_id, event_type);
CREATE INDEX idx_mental_health_gaps_date ON mental_health_gaps(user_id, date);

-- Pattern analysis
CREATE INDEX idx_energy_patterns_user_time ON user_energy_patterns(user_id, day_of_week, hour_of_day);
CREATE INDEX idx_user_patterns_type ON user_patterns(user_id, pattern_type);

-- Brain trap detection
CREATE INDEX idx_brain_traps_user_time ON brain_trap_detections(user_id, detected_at);
CREATE INDEX idx_choice_prompts_user_time ON choice_prompts(user_id, sent_at);

-- Analytics and reporting
CREATE INDEX idx_success_timeline_user_date ON user_success_timeline(user_id, occurred_date);
CREATE INDEX idx_sunday_planning_user_date ON sunday_planning_sessions(user_id, week_start_date);

-- Memory and foundation
CREATE INDEX idx_memory_context_user_type ON user_memory_context(user_id, context_type);
CREATE INDEX idx_foundation_user_version ON user_foundation_documents(user_id, version);
```

---

## 🚀 **PHASE 1 STEP 3: ENHANCED CONVERSATION ENGINE WITH STRUCTURED PRIORITIZATION**

### **Implementation Status**: 🚀 READY TO DEPLOY - Complete 10-phase structured prioritization system

### **Purpose**: 
The Enhanced Conversation Engine transforms scattered ADHD brain dumps into systematic, values-aligned calendars through a revolutionary 10-phase structured prioritization methodology. This section adds the specific tables needed for Step 3 implementation.

---

## 🎯 **STEP 3 SPECIFIC ENHANCEMENTS**

### Enhanced `conversations` Table (Add Step 3 Fields)
```sql
-- Add these fields to existing conversations table for Step 3
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS current_phase INTEGER DEFAULT 1; -- 1-10 for structured prioritization phases
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS phase_completion_status JSONB DEFAULT '{}'; -- track which phases are complete
```

### Enhanced `conversation_messages` Table (Add Step 3 Fields)
```sql
-- Add these fields to existing conversation_messages table for Step 3
ALTER TABLE conversation_messages ADD COLUMN IF NOT EXISTS phase_context INTEGER; -- which phase this message belongs to
```

### `conversation_extracts` (Enhanced for Step 3)
```sql
CREATE TABLE IF NOT EXISTS conversation_extracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Extract Classification
  extract_type VARCHAR(50) NOT NULL, -- 'priority', 'value', 'constraint', 'energy_pattern', 'adhd_pattern', 'adhd_tax_transformation'
  phase_number INTEGER, -- which phase (1-10) this came from
  
  -- Content
  raw_content TEXT NOT NULL, -- what user actually said
  structured_data JSONB NOT NULL, -- AI interpretation and categorization
  confidence_score FLOAT DEFAULT 0.8,
  
  -- Categorization for Structured Prioritization
  category VARCHAR(50), -- 'work', 'personal', 'health', 'family', 'creative'
  priority_level INTEGER, -- 1-10 ranking
  values_alignment JSONB, -- which core values this connects to
  seasonal_relevance VARCHAR(20), -- 'current', 'future', 'seasonal'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `user_priority_rankings` (NEW for Step 3)
```sql
CREATE TABLE IF NOT EXISTS user_priority_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  -- Priority Details
  priority_title VARCHAR(255) NOT NULL,
  priority_description TEXT,
  category VARCHAR(50), -- 'work', 'personal', 'health', 'family', 'creative'
  
  -- Systematic Scoring (1-10 scale each)
  values_alignment_score INTEGER CHECK (values_alignment_score >= 1 AND values_alignment_score <= 10),
  energy_match_score INTEGER CHECK (energy_match_score >= 1 AND energy_match_score <= 10),
  seasonal_relevance_score INTEGER CHECK (seasonal_relevance_score >= 1 AND seasonal_relevance_score <= 10),
  constraint_compatibility_score INTEGER CHECK (constraint_compatibility_score >= 1 AND constraint_compatibility_score <= 10),
  
  -- Calculated Rankings
  total_score INTEGER, -- sum of all scores
  final_ranking INTEGER, -- 1-N ranking within category
  tier_classification VARCHAR(10), -- 'tier_1', 'tier_2', 'tier_3'
  
  -- Context
  current_life_season VARCHAR(100),
  core_values_referenced JSONB,
  energy_patterns_considered JSONB,
  constraints_factored JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `adhd_tax_transformations` (NEW for Step 3)
```sql
CREATE TABLE IF NOT EXISTS adhd_tax_transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  
  -- Burdensome Task Details
  task_title VARCHAR(255) NOT NULL,
  task_description TEXT,
  task_category VARCHAR(50), -- 'financial_admin', 'health_admin', 'legal_paperwork', 'home_maintenance'
  mental_weight_rating INTEGER CHECK (mental_weight_rating >= 1 AND mental_weight_rating <= 10),
  
  -- Energizing Transformation
  reward_activity VARCHAR(255) NOT NULL, -- immediate reward after task
  energy_window_scheduled VARCHAR(100), -- when to do it (e.g., "Tuesday 10:30am post-workout")
  estimated_duration_minutes INTEGER,
  celebration_method VARCHAR(255), -- how to celebrate completion
  
  -- Transformation Strategy
  progress_over_perfection BOOLEAN DEFAULT true,
  minimum_viable_progress VARCHAR(255), -- what counts as progress
  context_switching_support VARCHAR(255), -- what to do after draining task
  
  -- Tracking
  scheduled_date DATE,
  completion_status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'rescheduled'
  actual_progress_made TEXT,
  user_energy_after INTEGER, -- 1-10 how they felt after
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enhanced `calendar_events` Table (Add Step 3 Fields)
```sql
-- Add these fields to existing calendar_events table for Step 3
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS priority_tier VARCHAR(10); -- 'tier_1', 'tier_2', 'tier_3'
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS adhd_tax_pairing UUID REFERENCES adhd_tax_transformations(id); -- link to reward pairing
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS values_alignment JSONB; -- which core values this serves
```

---

## 🔒 **STEP 3 SPECIFIC INDEXES & SECURITY**

```sql
-- Step 3 specific indexes
CREATE INDEX IF NOT EXISTS idx_priority_rankings_user ON user_priority_rankings(user_id, final_ranking);
CREATE INDEX IF NOT EXISTS idx_adhd_tax_user_status ON adhd_tax_transformations(user_id, completion_status);
CREATE INDEX IF NOT EXISTS idx_extracts_phase ON conversation_extracts(user_id, phase_number);
CREATE INDEX IF NOT EXISTS idx_conversations_phase ON conversations(user_id, current_phase);

-- Step 3 RLS policies
CREATE POLICY "Users can manage own priority rankings" ON user_priority_rankings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own adhd tax items" ON adhd_tax_transformations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own conversation extracts" ON conversation_extracts FOR ALL USING (user_id = auth.uid());

-- Enable RLS on new tables
ALTER TABLE user_priority_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhd_tax_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_extracts ENABLE ROW LEVEL SECURITY;
```

---

## ✅ **STEP 3 VALIDATION COMMANDS**

```sql
-- Verify Step 3 tables were created
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('user_priority_rankings', 'adhd_tax_transformations', 'conversation_extracts')
ORDER BY tablename;

-- Check Step 3 specific indexes
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname IN ('idx_priority_rankings_user', 'idx_adhd_tax_user_status', 'idx_extracts_phase')
ORDER BY tablename;

-- Verify Step 3 RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('user_priority_rankings', 'adhd_tax_transformations', 'conversation_extracts')
ORDER BY tablename;
```

---

## 🎉 **DEPLOYMENT INSTRUCTIONS**

1. **Run the Schema**: Copy `goodberry-schema.sql` into Supabase SQL Editor
2. **Verify Tables**: Run validation queries to confirm setup
3. **Test Basic Operations**: Create/read/delete test user
4. **Begin Implementation**: Start building Enhanced Conversation Engine code

**Database is ready for Enhanced Conversation Engine Step 3!**

*Built with ADHD brains in mind - every table designed for neurodivergent success patterns.* 💙 