# 🗄️ goodberry - Database Schema Documentation
## Calendar First - ADHD Brain-Friendly Data Structure

## 🧠 **ADHD-Friendly Development Notes**
**⚠️ IMPORTANT: Always ask Daniel only ONE question at a time - he has ADHD too!**

### 📁 **Key Files to Reference (Stay In-Scope)**
- **Product Requirements**: `docs/product-requirements.md` - Calendar First features
- **Roadmap**: `docs/roadmap.md` - Implementation timeline
- **Backend Code**: `src/` directory - Current implementation
- **Landing Page**: `goodberry-landing/src/components/calendar/CalendarHeroSection.tsx` - Live demo

### 🎯 **Scope Boundaries**
- ✅ **In-Scope**: Conversational calendar data, mental health gaps, brain trap patterns, ADHD energy tracking
- ❌ **Out-of-Scope**: External app integrations, generic productivity metrics, neurotypical calendar assumptions

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
CREATE INDEX idx_optimizations_user_date ON calendar_optimizations(user_id, optimization_date);
CREATE INDEX idx_weekly_emails_user_sent ON weekly_emails(user_id, sent_at);
```

---

## 🚀 **Migration Strategy**

### Phase 1: Core Calendar Tables
1. Create `users`, `calendar_events`, `mental_health_gaps`
2. Implement basic conversational calendar building
3. Mental Health Gap preservation algorithm

### Phase 2: Conversation System
1. Add `conversations`, `conversation_messages`
2. Sunday planning session tracking
3. Basic pattern recognition

### Phase 3: Brain Trap Detection
1. Implement `brain_trap_detections`, `choice_prompts`
2. Late-night intervention system
3. Choice framework engine

### Phase 4: Advanced Analytics
1. Full pattern learning system
2. Calendar optimization engine
3. Effectiveness tracking and user feedback loops

---

## 📊 **Key Metrics to Track**

### Calendar Health Metrics
- **Mental Health Gap Preservation Rate**: % of weeks with protected decompression time
- **Energy Pattern Alignment**: % of high-energy tasks scheduled during optimal times
- **Buffer Time Effectiveness**: Average stress reduction from automatic spacing

### Conversation Quality Metrics
- **Sunday Planning Completion Rate**: % of successful weekly planning sessions
- **AI Understanding Accuracy**: % of user intents correctly interpreted
- **User Satisfaction with Tone**: Rating of gentle, ADHD-friendly communication

### Brain Trap Intervention Metrics
- **Detection Accuracy**: % of actual brain traps correctly identified
- **Choice Response Rate**: % of users who respond to choice prompts
- **Intervention Effectiveness**: % of brain traps successfully interrupted

### Long-term Success Metrics
- **Calendar Satisfaction Growth**: "Finally works with my ADHD brain" sentiment over time
- **Choice Awareness Development**: Growth in conscious decision-making
- **Pattern Learning Accuracy**: AI improvement in predicting user needs

---

*Built with 💙 for ADHD brains who deserve data structures that actually understand them* 