-- 🎯 GOODBERRY ENHANCED CONVERSATION ENGINE DATABASE SETUP
-- Step 3: Structured Prioritization System
-- Run this in Supabase SQL Editor

-- ========================================
-- 🧠 SECTION 1: CORE USER SYSTEM
-- ========================================

-- Core users table with ADHD-specific fields
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
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

-- User energy patterns tracking
CREATE TABLE IF NOT EXISTS user_energy_patterns (
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

-- ========================================
-- 💬 SECTION 2: CONVERSATION SYSTEM
-- ========================================

-- Main conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Conversation Classification
  conversation_type VARCHAR(50) NOT NULL, -- 'onboarding', 'sunday_planning', 'brain_trap', 'optimization', 'structured_prioritization'
  session_goal TEXT,
  
  -- Structured Prioritization Context
  current_phase INTEGER DEFAULT 1, -- 1-10 for the 10-phase system
  phase_completion_status JSONB DEFAULT '{}', -- track completion of each phase
  
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

-- Individual conversation messages
CREATE TABLE IF NOT EXISTS conversation_messages (
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

-- Extract insights from conversations for memory system
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

-- ========================================
-- 🎯 SECTION 3: STRUCTURED PRIORITIZATION SYSTEM
-- ========================================

-- Systematic priority rankings with scoring methodology
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

-- ADHD Tax Transformation - convert burdensome tasks into energizing plans
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

-- Priority protection rules for calendar events
CREATE TABLE IF NOT EXISTS priority_protection_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Protection Classification
  protection_tier VARCHAR(10) NOT NULL, -- 'tier_1', 'tier_2', 'tier_3'
  priority_title VARCHAR(255) NOT NULL,
  protection_level VARCHAR(20) NOT NULL, -- 'sacred', 'high', 'flexible'
  
  -- Protection Rules
  never_schedule_over BOOLEAN DEFAULT false, -- absolute protection
  requires_user_approval BOOLEAN DEFAULT true, -- ask before moving
  minimum_buffer_before INTEGER DEFAULT 15, -- minutes
  minimum_buffer_after INTEGER DEFAULT 15, -- minutes
  
  -- Context Rules
  energy_window_requirements JSONB, -- specific energy needs
  seasonal_adjustments JSONB, -- how protection changes by season
  constraint_considerations JSONB, -- factors that affect protection
  
  -- Application Tracking
  times_protected INTEGER DEFAULT 0,
  times_violated INTEGER DEFAULT 0,
  user_satisfaction_with_protection INTEGER, -- 1-10 rating
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track how priorities shift with life seasons
CREATE TABLE IF NOT EXISTS seasonal_priority_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Season Details
  season_name VARCHAR(100) NOT NULL, -- 'school_year', 'summer', 'winter', 'work_busy_season'
  season_start_date DATE,
  season_end_date DATE,
  current_season BOOLEAN DEFAULT false,
  
  -- Priority Adjustments
  priority_shifts JSONB, -- how priorities change during this season
  time_allocation_changes JSONB, -- work/personal percentage shifts
  energy_pattern_adjustments JSONB, -- how energy changes
  constraint_modifications JSONB, -- what constraints are different
  
  -- Examples and Context
  example_adjustments TEXT, -- specific examples of how things change
  triggers_for_season VARCHAR(255), -- what signals this season starting
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 📅 SECTION 4: CALENDAR SYSTEM
-- ========================================

-- Calendar events with ADHD-specific features
CREATE TABLE IF NOT EXISTS calendar_events (
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
  
  -- Structured Prioritization Integration
  priority_tier VARCHAR(10), -- 'tier_1', 'tier_2', 'tier_3'
  adhd_tax_pairing UUID REFERENCES adhd_tax_transformations(id), -- link to reward pairing
  values_alignment JSONB, -- which core values this serves
  
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

-- Mental health gaps - protected unscheduled time
CREATE TABLE IF NOT EXISTS mental_health_gaps (
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

-- External calendar sync (Google Calendar integration)
CREATE TABLE IF NOT EXISTS external_calendar_sync (
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

-- ========================================
-- 🧠 SECTION 5: MEMORY & FOUNDATION SYSTEM
-- ========================================

-- Persistent AI memory system
CREATE TABLE IF NOT EXISTS user_memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Memory Categories
  context_type VARCHAR(50) NOT NULL, -- 'core_identity', 'preferences', 'patterns', 'recent_context', 'calendar_habits'
  context_subtype VARCHAR(50), -- 'energy_patterns', 'joy_patterns', 'constraint_patterns'
  context_key VARCHAR(100) NOT NULL, -- 'communication_style', 'henry_priority', 'post_workout_energy'
  
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

-- Foundation documents from onboarding conversations
CREATE TABLE IF NOT EXISTS user_foundation_documents (
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

-- Success timeline for confidence building
CREATE TABLE IF NOT EXISTS user_success_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Success Categories
  success_type VARCHAR(50) NOT NULL, -- 'scheduling_win', 'life_improvement', 'personal_growth', 'system_adoption'
  success_area VARCHAR(50), -- 'calendar_management', 'energy_optimization', 'family_time', 'work_productivity'
  
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
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 🧠 SECTION 6: BRAIN TRAP & CHOICE SYSTEM
-- ========================================

-- Brain trap detection for ADHD support
CREATE TABLE IF NOT EXISTS brain_trap_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Detection Details
  trap_type VARCHAR(50) NOT NULL, -- 'late_night_spiral', 'procrastination_loop', 'hyperfocus_overrun'
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

-- Choice prompts with 3-option framework
CREATE TABLE IF NOT EXISTS choice_prompts (
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

-- ========================================
-- 📧 SECTION 7: COMMUNICATION SYSTEM
-- ========================================

-- Sunday planning sessions
CREATE TABLE IF NOT EXISTS sunday_planning_sessions (
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

-- Weekly emails for user engagement
CREATE TABLE IF NOT EXISTS weekly_emails (
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

-- ========================================
-- 🔍 SECTION 8: INDEXES FOR PERFORMANCE
-- ========================================

-- User and conversation lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_conversations_user_type ON conversations(user_id, conversation_type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_order ON conversation_messages(conversation_id, message_order);

-- Calendar event queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_time ON calendar_events(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_mental_health_gaps_date ON mental_health_gaps(user_id, date);

-- Structured prioritization lookups
CREATE INDEX IF NOT EXISTS idx_priority_rankings_user ON user_priority_rankings(user_id, final_ranking);
CREATE INDEX IF NOT EXISTS idx_adhd_tax_user_status ON adhd_tax_transformations(user_id, completion_status);
CREATE INDEX IF NOT EXISTS idx_protection_rules_user_tier ON priority_protection_rules(user_id, protection_tier);

-- Memory and foundation lookups
CREATE INDEX IF NOT EXISTS idx_memory_context_user_type ON user_memory_context(user_id, context_type);
CREATE INDEX IF NOT EXISTS idx_foundation_user_version ON user_foundation_documents(user_id, version);
CREATE INDEX IF NOT EXISTS idx_success_timeline_user_date ON user_success_timeline(user_id, occurred_date);

-- Brain trap and choice lookups
CREATE INDEX IF NOT EXISTS idx_brain_traps_user_time ON brain_trap_detections(user_id, detected_at);
CREATE INDEX IF NOT EXISTS idx_choice_prompts_user_time ON choice_prompts(user_id, sent_at);

-- Analytics and reporting
CREATE INDEX IF NOT EXISTS idx_energy_patterns_user_time ON user_energy_patterns(user_id, day_of_week, hour_of_day);
CREATE INDEX IF NOT EXISTS idx_sunday_planning_user_date ON sunday_planning_sessions(user_id, week_start_date);

-- ========================================
-- 🔒 SECTION 9: ROW LEVEL SECURITY
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_energy_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_extracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_priority_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhd_tax_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_protection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_priority_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_calendar_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_foundation_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_success_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_trap_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE choice_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sunday_planning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
-- Basic user access patterns
CREATE POLICY "Users can manage own data" ON users FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Users can manage own energy patterns" ON user_energy_patterns FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own messages" ON conversation_messages FOR ALL USING (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own extracts" ON conversation_extracts FOR ALL USING (user_id = auth.uid());

-- Structured prioritization access
CREATE POLICY "Users can manage own priority rankings" ON user_priority_rankings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own adhd tax items" ON adhd_tax_transformations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own protection rules" ON priority_protection_rules FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own seasonal adjustments" ON seasonal_priority_adjustments FOR ALL USING (user_id = auth.uid());

-- Calendar access
CREATE POLICY "Users can manage own calendar events" ON calendar_events FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own mental health gaps" ON mental_health_gaps FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own calendar sync" ON external_calendar_sync FOR ALL USING (user_id = auth.uid());

-- Memory and foundation access
CREATE POLICY "Users can manage own memory context" ON user_memory_context FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own foundation docs" ON user_foundation_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own success timeline" ON user_success_timeline FOR ALL USING (user_id = auth.uid());

-- Brain trap and choice access
CREATE POLICY "Users can manage own brain trap data" ON brain_trap_detections FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own choice prompts" ON choice_prompts FOR ALL USING (user_id = auth.uid());

-- Communication access
CREATE POLICY "Users can manage own planning sessions" ON sunday_planning_sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own weekly emails" ON weekly_emails FOR ALL USING (user_id = auth.uid());

-- ========================================
-- ✅ SECTION 10: VALIDATION QUERIES
-- ========================================

-- Check table creation
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'users', 'conversations', 'calendar_events', 'user_memory_context', 
        'user_foundation_documents', 'user_priority_rankings', 'adhd_tax_transformations'
    )
ORDER BY tablename;

-- Check indexes
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'conversations', 'calendar_events')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('users', 'conversations', 'calendar_events')
ORDER BY tablename;

-- Verify foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('conversations', 'calendar_events', 'user_priority_rankings')
ORDER BY tc.table_name;

-- ========================================
-- 🎯 SECTION 11: INITIAL DATA SETUP
-- ========================================

-- Create a function to migrate waitlist users to main users table
CREATE OR REPLACE FUNCTION migrate_waitlist_to_users()
RETURNS TABLE(migrated_count INTEGER) AS $$
DECLARE
    migration_count INTEGER := 0;
BEGIN
    -- Insert waitlist users into users table (avoiding duplicates)
    INSERT INTO users (email, name, phone, created_at)
    SELECT 
        w.email,
        w.name,
        w.phone,
        w.created_at
    FROM waitlist w
    LEFT JOIN users u ON u.email = w.email
    WHERE u.email IS NULL;
    
    GET DIAGNOSTICS migration_count = ROW_COUNT;
    
    RETURN QUERY SELECT migration_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 🏁 SETUP COMPLETE MESSAGE
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '🎯 GOODBERRY ENHANCED CONVERSATION ENGINE DATABASE SETUP COMPLETE!';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Core Systems Ready:';
    RAISE NOTICE '   - User management with ADHD profiles';
    RAISE NOTICE '   - 10-phase conversation system';
    RAISE NOTICE '   - Structured prioritization engine';
    RAISE NOTICE '   - Calendar integration with protection';
    RAISE NOTICE '   - Memory & foundation document system';
    RAISE NOTICE '   - Brain trap detection & choice framework';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Security: Row Level Security enabled on all tables';
    RAISE NOTICE '⚡ Performance: Indexes created for core queries';
    RAISE NOTICE '🔗 Integration: Ready for Google Calendar API';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next Steps:';
    RAISE NOTICE '   1. Run validation queries above to confirm setup';
    RAISE NOTICE '   2. Test user creation and conversation flow';
    RAISE NOTICE '   3. Begin Enhanced Conversation Engine implementation';
    RAISE NOTICE '';
    RAISE NOTICE '💙 Built with ADHD brains in mind - Let\'s make this amazing!';
END $$; 