-- 🔧 FINAL DATABASE SCHEMA FIX for Complete Conversation Engine
-- Add missing active_conversation_id column to users table

-- 1. Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS active_conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL;

-- 2. Add missing columns we identified earlier
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS session_goal TEXT;

ALTER TABLE conversation_messages
ADD COLUMN IF NOT EXISTS phase_context INTEGER;

-- 3. Set default values for existing records
UPDATE conversations 
SET session_goal = 'Transform scattered ADHD thoughts into systematic values-aligned calendar'
WHERE session_goal IS NULL;

UPDATE conversation_messages
SET phase_context = 1
WHERE phase_context IS NULL;

-- 4. Verify all required columns exist
SELECT 'users table check:' as table_check;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('active_conversation_id', 'id', 'phone')
ORDER BY column_name;

SELECT 'conversations table check:' as table_check;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
  AND column_name IN ('session_goal', 'current_phase', 'user_id')
ORDER BY column_name;

SELECT 'conversation_messages table check:' as table_check;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversation_messages' 
  AND column_name IN ('phase_context', 'conversation_id', 'role')
ORDER BY column_name; 