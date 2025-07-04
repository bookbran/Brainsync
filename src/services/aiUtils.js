const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Use Claude to extract user intent and potential events from a message
 * @param {string} message - The user's message
 * @param {object} userContext - The user's context (for personalization, optional)
 * @param {object} [options] - Optional: pass a custom list of intents or extra context
 * @returns {Promise<{ intent: string, events: array }>}
 */
async function getIntentAndEventsFromClaude(message, userContext = {}, options = {}) {
  const defaultIntents = [
    'connect_calendar',
    'view_calendar',
    'calendar_planning',
    'event_scheduling',
    'adhd_support',
    'greeting',
    'see_suggestions',
    'schedule_event',
    'reminder',
    'general'
  ];
  const intents = options.intents || defaultIntents;
  const prompt = `You are Goodberry, an ADHD-friendly calendar assistant. Analyze the following user message and return a JSON object with two fields:

1. intent: One of the following (choose the best match):\n- ${intents.join("\n- ")}
2. events: An array of objects, each with:\n- rawText: the text describing a potential event (if any)\n- type: 'potential_event' or a more specific type if you can infer it (e.g. 'meeting', 'appointment')\n- needsConfirmation: true if you are not sure about the event details

User message: "${message}"

Respond ONLY with a JSON object like:\n{"intent": "event_scheduling", "events": [{"rawText": "meeting with Alex Tuesday 2pm", "type": "meeting", "needsConfirmation": true}]}`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 300,
    system: prompt,
    messages: [
      { role: 'user', content: message }
    ]
  });

  try {
    return JSON.parse(response.content[0].text);
  } catch (e) {
    return { intent: 'general', events: [] };
  }
}

module.exports = {
  getIntentAndEventsFromClaude
}; 