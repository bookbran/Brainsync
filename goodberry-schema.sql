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
  energy_pattern_type VARCHAR(20) DEFAULT 'unknown',
  
  -- Conversation Preferences
  conversation_style VARCHAR(20) DEFAULT 'gentle',
  brain_trap_sensitivity VARCHAR(20) DEFAULT 'medium',
  
  -- Calendar Preferences
  mental_health_gap_duration INTEGER DEFAULT 120,
  buffer_time_preference INTEGER DEFAULT 15,
  max_daily_commitments INTEGER DEFAULT 5,
  
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
  conversation_type VARCHAR(50) NOT NULL,
  current_phase INTEGER DEFAULT 1,
  phase_completion_status JSONB DEFAULT '{}',
  
  -- Status & Outcomes
  status VARCHAR(20) DEFAULT 'active',
  completion_quality VARCHAR(20),
  events_created INTEGER DEFAULT 0,
  patterns_identified INTEGER DEFAULT 0,
  user_satisfaction INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual conversation messages
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message Details
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  message_order INTEGER NOT NULL,
  
  -- AI Context
  intent_detected VARCHAR(100),
  entities_extracted JSONB,
  ai_confidence FLOAT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extract insights from conversations
CREATE TABLE IF NOT EXISTS conversation_extracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Extract Classification
  extract_type VARCHAR(50) NOT NULL,
  phase_number INTEGER,
  
  -- Content
  raw_content TEXT NOT NULL,
  structured_data JSONB NOT NULL,
  confidence_score FLOAT DEFAULT 0.8,
  
  -- Categorization
  category VARCHAR(50),
  priority_level INTEGER,
  values_alignment JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 🎯 SECTION 3: STRUCTURED PRIORITIZATION
-- ========================================

-- Systematic priority rankings
CREATE TABLE IF NOT EXISTS user_priority_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Priority Details
  priority_title VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  
  -- Systematic Scoring (1-10 scale)
  values_alignment_score INTEGER CHECK (values_alignment_score >= 1 AND values_alignment_score <= 10),
  energy_match_score INTEGER CHECK (energy_match_score >= 1 AND energy_match_score <= 10),
  seasonal_relevance_score INTEGER CHECK (seasonal_relevance_score >= 1 AND seasonal_relevance_score <= 10),
  constraint_compatibility_score INTEGER CHECK (constraint_compatibility_score >= 1 AND constraint_compatibility_score <= 10),
  
  -- Rankings
  total_score INTEGER,
  tier_classification VARCHAR(10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADHD Tax Transformation
CREATE TABLE IF NOT EXISTS adhd_tax_transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Task Details
  task_title VARCHAR(255) NOT NULL,
  task_category VARCHAR(50),
  mental_weight_rating INTEGER CHECK (mental_weight_rating >= 1 AND mental_weight_rating <= 10),
  
  -- Transformation
  reward_activity VARCHAR(255) NOT NULL,
  energy_window_scheduled VARCHAR(100),
  completion_status VARCHAR(20) DEFAULT 'planned',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 📅 SECTION 4: CALENDAR SYSTEM
-- ========================================

-- Calendar events with ADHD features
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Event Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- ADHD Classification
  event_type VARCHAR(50) NOT NULL,
  energy_requirement VARCHAR(20),
  priority_level VARCHAR(20) DEFAULT 'medium',
  
  -- Protection & Flexibility
  is_protected BOOLEAN DEFAULT false,
  is_flexible BOOLEAN DEFAULT true,
  buffer_before INTEGER DEFAULT 0,
  buffer_after INTEGER DEFAULT 0,
  
  -- Structured Prioritization
  priority_tier VARCHAR(10),
  adhd_tax_pairing UUID REFERENCES adhd_tax_transformations(id),
  
  -- Integration
  google_calendar_id VARCHAR(255),
  conversation_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 🧠 SECTION 5: MEMORY SYSTEM
-- ========================================

-- Persistent AI memory
CREATE TABLE IF NOT EXISTS user_memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Memory Categories
  context_type VARCHAR(50) NOT NULL,
  context_key VARCHAR(100) NOT NULL,
  
  -- Content
  summary TEXT NOT NULL,
  structured_data JSONB,
  confidence_score FLOAT DEFAULT 1.0,
  
  -- Tracking
  observation_count INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, context_type, context_key)
);

-- Foundation documents
CREATE TABLE IF NOT EXISTS user_foundation_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Core Foundation
  core_values JSONB NOT NULL,
  work_personal_allocation JSONB,
  priority_hierarchy JSONB,
  
  -- ADHD Patterns
  energy_patterns JSONB,
  communication_preferences JSONB,
  scheduling_preferences JSONB,
  
  -- Quality & Evolution
  completeness_score FLOAT DEFAULT 0.5,
  version INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 🔒 SECTION 6: SECURITY & INDEXES
-- ========================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_conversations_user_type ON conversations(user_id, conversation_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_time ON calendar_events(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_memory_context_user_type ON user_memory_context(user_id, context_type);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_extracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_priority_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhd_tax_transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_foundation_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own data" ON users FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own messages" ON conversation_messages FOR ALL USING (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own extracts" ON conversation_extracts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own rankings" ON user_priority_rankings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own adhd tax items" ON adhd_tax_transformations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own events" ON calendar_events FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own memory" ON user_memory_context FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own foundation" ON user_foundation_documents FOR ALL USING (user_id = auth.uid());

-- ========================================
-- ✅ SECTION 7: VALIDATION QUERIES
-- ========================================

-- Run these to confirm setup worked:

-- 1. Check tables were created
SELECT 
    tablename
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
        'users', 'conversations', 'calendar_events', 'user_memory_context', 
        'user_foundation_documents', 'user_priority_rankings', 'adhd_tax_transformations'
    )
ORDER BY tablename;

-- 2. Check indexes
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname LIKE 'idx_%'
ORDER BY tablename;

-- 3. Check RLS is enabled
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND (tablename LIKE 'user%' OR tablename LIKE 'conversation%')
ORDER BY tablename;

-- 4. Test basic operations
INSERT INTO users (email, name) VALUES ('test@goodberry.ai', 'Test User');
SELECT id, email, name FROM users WHERE email = 'test@goodberry.ai';
DELETE FROM users WHERE email = 'test@goodberry.ai';

-- ========================================
-- 🎉 SETUP COMPLETE!
-- ========================================

-- Schema is ready for Enhanced Conversation Engine Step 3!
-- All core tables, indexes, and security policies are in place.

-- Next steps:
-- 1. Run these validation queries to confirm everything works
-- 2. Begin implementing the 10-phase conversation flow
-- 3. Test the structured prioritization system

-- 💙 Built for ADHD brains - let's make this amazing!
