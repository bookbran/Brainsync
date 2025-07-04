-- 🔧 Database Schema Fix for Structured Prioritization Engine
-- Add missing session_goal column to conversations table

-- Add the missing session_goal column
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS session_goal TEXT;

-- Optional: Set a default value for existing conversations
UPDATE conversations 
SET session_goal = 'Transform scattered ADHD thoughts into systematic values-aligned calendar'
WHERE session_goal IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
  AND column_name = 'session_goal';

-- Test that we can now create conversations with session_goal
-- (This will be cleaned up after the test)
-- DO $$
-- BEGIN
--   INSERT INTO conversations (user_id, conversation_type, session_goal) 
--   VALUES (gen_random_uuid(), 'test', 'Test session goal');
--   DELETE FROM conversations WHERE conversation_type = 'test';
-- END $$; 