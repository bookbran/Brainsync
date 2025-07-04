-- 🔧 COMPLETE DATABASE SCHEMA FIX for Structured Prioritization Engine
-- Add all missing columns to make the engine work

-- 1. Add missing session_goal column to conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS session_goal TEXT;

-- 2. Add missing phase_context column to conversation_messages table  
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
SELECT 'conversations table columns:' as check_type;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
  AND column_name IN ('session_goal', 'current_phase', 'phase_completion_status')
ORDER BY column_name;

SELECT 'conversation_messages table columns:' as check_type;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversation_messages' 
  AND column_name IN ('phase_context', 'role', 'content', 'message_order')
ORDER BY column_name;

-- 5. Test that we can now insert properly structured data
-- (This will be cleaned up after test)
-- DO $$
-- DECLARE
--   test_user_id UUID := gen_random_uuid();
--   test_conversation_id UUID;
-- BEGIN
--   -- Test user creation
--   INSERT INTO users (id, email, name, phone) 
--   VALUES (test_user_id, 'schema-test@example.com', 'Schema Test', '+15551111111');
--   
--   -- Test conversation creation with session_goal
--   INSERT INTO conversations (user_id, conversation_type, session_goal, current_phase) 
--   VALUES (test_user_id, 'structured_prioritization', 'Test session goal', 1)
--   RETURNING id INTO test_conversation_id;
--   
--   -- Test message creation with phase_context
--   INSERT INTO conversation_messages (conversation_id, role, content, message_order, phase_context)
--   VALUES (test_conversation_id, 'user', 'Test message', 1, 1);
--   
--   -- Clean up test data
--   DELETE FROM conversation_messages WHERE conversation_id = test_conversation_id;
--   DELETE FROM conversations WHERE id = test_conversation_id;
--   DELETE FROM users WHERE id = test_user_id;
--   
--   RAISE NOTICE 'Schema test completed successfully!';
-- END $$; 