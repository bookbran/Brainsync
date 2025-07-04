-- 📊 BrainSync Conversation Engine Database Monitoring Queries
-- Run these in Supabase SQL Editor to track phase progression and data capture

-- ===========================================
-- 🎯 1. TRACK CONVERSATION PHASES & PROGRESS
-- ===========================================

-- See all active conversations and their current phases
SELECT 
    c.id as conversation_id,
    u.name,
    u.phone,
    c.conversation_type,
    c.current_phase,
    c.phase_completion_status,
    c.session_goal,
    c.status,
    c.created_at,
    c.updated_at
FROM conversations c
JOIN users u ON c.user_id = u.id
WHERE c.conversation_type = 'structured_prioritization'
ORDER BY c.updated_at DESC;

-- ===========================================
-- 💬 2. VIEW CONVERSATION FLOW BY PHASES
-- ===========================================

-- See all messages for a specific conversation (replace with actual conversation_id)
SELECT 
    cm.id,
    cm.role,
    cm.content,
    cm.phase_context,
    cm.message_order,
    cm.created_at
FROM conversation_messages cm
WHERE cm.conversation_id = 'YOUR_CONVERSATION_ID_HERE'
ORDER BY cm.message_order;

-- See message count by phase for all conversations
SELECT 
    phase_context,
    COUNT(*) as message_count,
    COUNT(DISTINCT conversation_id) as conversation_count
FROM conversation_messages 
WHERE phase_context IS NOT NULL
GROUP BY phase_context
ORDER BY phase_context;

-- ===========================================
-- 🧠 3. EXTRACTED INSIGHTS & DATA CAPTURE
-- ===========================================

-- View all insights extracted from conversations
SELECT 
    ce.id,
    u.name,
    u.phone,
    ce.extract_type,
    ce.phase_number,
    ce.raw_content,
    ce.structured_data,
    ce.category,
    ce.priority_level,
    ce.confidence_score,
    ce.created_at
FROM conversation_extracts ce
JOIN users u ON ce.user_id = u.id
ORDER BY ce.created_at DESC;

-- Count insights by phase
SELECT 
    phase_number,
    extract_type,
    COUNT(*) as insight_count
FROM conversation_extracts 
GROUP BY phase_number, extract_type
ORDER BY phase_number, extract_type;

-- ===========================================
-- 👤 4. USER PROGRESSION OVERVIEW  
-- ===========================================

-- See user progress through the 10-phase system
SELECT 
    u.name,
    u.phone,
    u.created_at as user_created,
    c.current_phase,
    c.phase_completion_status,
    COUNT(ce.id) as insights_captured,
    COUNT(cm.id) as total_messages,
    c.updated_at as last_activity
FROM users u
LEFT JOIN conversations c ON u.active_conversation_id = c.id
LEFT JOIN conversation_extracts ce ON u.id = ce.user_id
LEFT JOIN conversation_messages cm ON c.id = cm.conversation_id
GROUP BY u.id, u.name, u.phone, u.created_at, c.current_phase, c.phase_completion_status, c.updated_at
ORDER BY c.updated_at DESC;

-- ===========================================
-- 🔍 5. PHASE COMPLETION TRACKING
-- ===========================================

-- Track which phases users have completed
SELECT 
    u.phone,
    c.current_phase,
    c.phase_completion_status,
    CASE 
        WHEN c.current_phase >= 2 THEN '✅ Phase 1: Brain Dump Complete'
        ELSE '⏳ Phase 1: In Progress'
    END as phase_1_status,
    CASE 
        WHEN c.current_phase >= 3 THEN '✅ Phase 2: Organization Complete'
        WHEN c.current_phase = 2 THEN '⏳ Phase 2: In Progress'
        ELSE '⏸️ Phase 2: Not Started'
    END as phase_2_status,
    CASE 
        WHEN c.current_phase >= 4 THEN '✅ Phase 3: ADHD Patterns Complete'
        WHEN c.current_phase = 3 THEN '⏳ Phase 3: In Progress'
        ELSE '⏸️ Phase 3: Not Started'
    END as phase_3_status
FROM users u
JOIN conversations c ON u.active_conversation_id = c.id
WHERE c.conversation_type = 'structured_prioritization'
ORDER BY c.current_phase DESC;

-- ===========================================
-- 📈 6. SYSTEM PERFORMANCE METRICS
-- ===========================================

-- Overall system stats
SELECT 
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(ce.id) as total_insights,
    COUNT(cm.id) as total_messages,
    AVG(c.current_phase) as avg_phase_reached
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN conversation_extracts ce ON u.id = ce.user_id  
LEFT JOIN conversation_messages cm ON c.id = cm.conversation_id
WHERE c.conversation_type = 'structured_prioritization' OR c.conversation_type IS NULL;

-- ===========================================
-- 🚀 7. QUICK TEST USER LOOKUP
-- ===========================================

-- Find your test user (replace phone number with one from your test)
SELECT 
    u.*,
    c.id as conversation_id,
    c.current_phase,
    c.phase_completion_status
FROM users u
LEFT JOIN conversations c ON u.active_conversation_id = c.id
WHERE u.phone LIKE '+1555%'  -- Adjust based on your test phone numbers
ORDER BY u.created_at DESC;

-- ===========================================
-- 💡 USAGE INSTRUCTIONS:
-- ===========================================
/*
1. Run the test script: .\manual-test.ps1
2. Note the phone number it generates
3. Use "Query 7" to find your test user
4. Use "Query 1" to see conversation progress  
5. Use "Query 2" to see message flow
6. Use "Query 3" to see captured insights
7. Use "Query 5" to track phase completion

Key things to watch for:
- current_phase should advance (1→2→3...)
- phase_completion_status should update
- conversation_extracts should capture insights
- message_order should increment properly
*/ 