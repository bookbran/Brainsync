const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');
const ProactiveSuggestionEngine = require('./proactiveSuggestionEngine');
const { getIntentAndEventsFromClaude } = require('./aiUtils');

class StructuredPrioritizationEngine {
  constructor() {
    // Ensure environment variables are loaded
    require('dotenv').config();

    // Initialize Anthropic client
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Initialize Supabase client with error checking
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Initialize proactive suggestion engine
    this.proactiveSuggestionEngine = new ProactiveSuggestionEngine();
  }

  async processConversation(userId, userMessage, conversationId) {
    try {
      logger.info('🎯 Processing structured prioritization conversation');

      // Get or create conversation
      const conversation = await this.getOrCreateConversation(userId, conversationId);

      // Store user message
      await this.storeMessage(conversation.id, 'user', userMessage);

      // Get conversation state and determine response
      const response = await this.generateResponse(conversation, userMessage, userId);

      // Store assistant response
      await this.storeMessage(conversation.id, 'assistant', response.text);

      // Store insights if any
      if (response.insights) {
        await this.storeInsights(conversation.id, response.insights);
      }

      return {
        response: response.text,
        conversationId: conversation.id,
        currentPhase: response.currentPhase,
        phaseCompleted: response.phaseCompleted,
        nextPhase: response.nextPhase,
        totalPhases: 10,
        milestone: response.milestone || {},
        isResuming: response.isResuming || false,
        completedPhases: response.completedPhases || 0
      };

    } catch (error) {
      logger.error('❌ Error in structured prioritization engine:', error);
      throw error;
    }
  }

  async getOrCreateConversation(userId, conversationId) {
    try {
      if (conversationId) {
        // Try to get existing conversation by ID
        const { data: existingConversation, error } = await this.supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();
        if (existingConversation && !error) {
          logger.info(`🔄 Using existing conversation - Phase: ${existingConversation.current_phase}, Step: ${existingConversation.phase_completion_status?.onboardingStep}`);
          return existingConversation;
        }
      }
      // Always try to resume the latest active structured_prioritization conversation for this user
      const { data: activeConvos, error: activeError } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('conversation_type', 'structured_prioritization')
        .eq('status', 'active')
        .order('current_phase', { ascending: false })
        .order('updated_at', { ascending: false })
        .limit(1);
      if (activeConvos && activeConvos.length > 0) {
        logger.info(`🔄 Resuming latest active conversation - Phase: ${activeConvos[0].current_phase}, Step: ${activeConvos[0].phase_completion_status?.onboardingStep}`);
        return activeConvos[0];
      }
      // Create new conversation - ALWAYS start with name collection
      logger.info('🆕 Creating new structured prioritization conversation (auto-start)');
      const { data: newConversation, error } = await this.supabase
        .from('conversations')
        .insert([{
          user_id: userId,
          conversation_type: 'structured_prioritization',
          current_phase: 0,
          phase_completion_status: { onboardingStep: 'name_collection' },
          status: 'active'
        }])
        .select()
        .single();
      if (error) throw error;
      logger.info(`✅ Created new conversation - Phase: ${newConversation.current_phase}, Step: ${newConversation.phase_completion_status?.onboardingStep}`);
      return newConversation;
    } catch (error) {
      logger.error('❌ Error getting/creating conversation:', error);
      throw error;
    }
  }

  async generateResponse(conversation, userMessage, userId) {
    try {
      // Always fetch the latest conversation state from the database
      const { data: freshConversation } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('id', conversation.id)
        .single();
      const state = freshConversation.phase_completion_status || {};
      const currentPhase = freshConversation.current_phase || 0;
      // Calendar consent logic after onboarding complete, before suggestions
      if (currentPhase === 10 && state.onboarding_completed && !state.calendarConsentRequested) {
        state.calendarConsentRequested = true;
        await this.supabase
          .from('conversations')
          .update({ phase_completion_status: state })
          .eq('id', conversation.id);
        
        // Generate actual OAuth URL
        const baseUrl = process.env.APP_URL || 'http://localhost:3000';
        const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
        
        return {
          text: `🎉 Welcome back! I'm so excited to help you build a calendar that actually works with your brain! 

I remember our amazing conversation about your priorities and values. Now I'd love to see your actual calendar so I can make personalized, ADHD-friendly suggestions that honor what matters most to you.

🔗 **Connect your Google Calendar here:**
${authUrl}

✨ **What happens next:**
• I'll see your upcoming events (with your permission)
• I'll suggest smart scheduling that protects your priorities
• You'll always have control - approve, modify, or skip anything I suggest
• We'll build your schedule together, one step at a time

Ready to make your calendar work FOR you instead of against you? 💙`,
          currentPhase: 10,
          phaseCompleted: true,
          nextPhase: 10,
          milestone: { onboardingComplete: true, calendarConsentRequested: true },
          proactiveSuggestions: state.proactive_suggestions
        };
      }
      // Only proceed to event analysis and suggestions after consent and connection
      if (currentPhase === 10 && state.calendarConsentRequested) {
        const { data: userRow } = await this.supabase
          .from('users')
          .select('id, calendar_connected')
          .eq('id', freshConversation.user_id)
          .single();
        if (!userRow || !userRow.calendar_connected) {
          // Check if this is a return message (hi, hello, where were we, etc.)
          const returnMessagePatterns = [
            /^(hi|hello|hey|yo|sup|what's up|wassup)/i,
            /where.*we.*again/i,
            /what.*happening/i,
            /how.*going/i,
            /back.*again/i
          ];
          
          const isReturnMessage = returnMessagePatterns.some(pattern => pattern.test(userMessage));
          
          // Generate actual OAuth URL for return users
          const baseUrl = process.env.APP_URL || 'http://localhost:3000';
          const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
          
          if (isReturnMessage) {
            return {
              text: `🧠💙 Hey there! I'm so glad you're back! 

I remember our conversation about your priorities and I'm ready to help you make your calendar work with your brain, not against it.

🔗 **Let's connect your Google Calendar:**
${authUrl}

Once connected, I can:
• See your actual schedule and suggest improvements
• Help you protect your most important priorities
• Suggest buffer time and ADHD-friendly scheduling
• Work with your natural energy patterns

No pressure - just click the link when you're ready! I'll be here waiting to help you build a calendar that celebrates who you are. ✨`,
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, calendarConsentRequested: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          } else {
            return {
              text: `🧠💙 Perfect! I'm ready to help you build a calendar that works with your brain!

🔗 **Connect your Google Calendar here:**
${authUrl}

Once connected, I can:
• See your actual schedule and suggest improvements
• Help you protect your most important priorities
• Suggest buffer time and ADHD-friendly scheduling
• Work with your natural energy patterns

Click the link above and I'll be here waiting to help you create a schedule that celebrates who you are! ✨`,
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, calendarConsentRequested: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
        }
        // After calendar is connected, fetch events and analyze with Claude before suggestions
        if (!state.calendarAnalyzed) {
          // Fetch events from Google Calendar (pseudo-code, replace with your actual fetch logic)
          const events = await this.fetchGoogleCalendarEvents(userRow.id);
          // Use Claude to analyze events for relevancy
          const analysisPrompt = 'You are Goodberry, an ADHD-friendly calendar assistant. Here are the user\'s upcoming calendar events: ' + JSON.stringify(events) + '.\n\nBased on their onboarding context: ' + JSON.stringify(state.onboarding_context || {}) + ', classify each event as one of: \'important\', \'non-negotiable\', \'constraint\', \'opportunity\', or \'other\'.\n\nReturn a JSON array of events with their classification and a short reason for each.';
          const aiAnalysisResponse = await this.anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            system: analysisPrompt,
            messages: [
              { role: 'user', content: 'Analyze these events for relevancy.' }
            ]
          });
          let analyzedEvents = [];
          try {
            analyzedEvents = JSON.parse(aiAnalysisResponse.content[0].text);
          } catch (e) { }
          // Store analyzed events in state
          state.calendarAnalyzed = true;
          state.analyzedEvents = analyzedEvents;
          await this.supabase
            .from('conversations')
            .update({ phase_completion_status: state })
            .eq('id', conversation.id);
          // Present summary to user for confirmation
          let summary = 'Here\'s what I see coming up in your calendar:\n';
          analyzedEvents.forEach(ev => {
            summary += `• ${ev.title} (${ev.start}): ${ev.classification} - ${ev.reason}\n`;
          });
          summary += '\nWhich of these are most important, non-negotiable, or flexible? You can reply with changes or just say "looks good".';
          return {
            text: summary,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, calendarConsentRequested: true, calendarAnalyzed: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        }
      }
      // After presenting the calendar analysis summary, handle user feedback
      if (state.calendarAnalyzed && !state.calendarConfirmed) {
        const feedbackPrompt = 'You are goodberry, an adhd-friendly calendar assistant. The user just reviewed this list of events and replied: "' + userMessage + '". Here is the list: ' + JSON.stringify(state.analyzedEvents) + '.\n\nUpdate the classification of each event if the user provided corrections. Return a JSON array of events with their final classification and a short reason for each.';
        const aiFeedbackResponse = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          system: feedbackPrompt,
          messages: [
            { role: 'user', content: userMessage }
          ]
        });
        let confirmedEvents = state.analyzedEvents;
        try {
          confirmedEvents = JSON.parse(aiFeedbackResponse.content[0].text);
        } catch (e) { }
        state.calendarConfirmed = true;
        state.confirmedEvents = confirmedEvents;
        await this.supabase
          .from('conversations')
          .update({ phase_completion_status: state })
          .eq('id', conversation.id);
        return {
          text: "Thanks for confirming your calendar! I'll use this info to make smart, personalized suggestions. Ready for your first one?",
          currentPhase: 10,
          phaseCompleted: true,
          nextPhase: 10,
          milestone: { onboardingComplete: true, calendarConsentRequested: true, calendarAnalyzed: true, calendarConfirmed: true },
          proactiveSuggestions: state.proactive_suggestions
        };
      }
      // After calendar is confirmed, generate and present one-at-a-time, context-aware suggestions
      if (
        currentPhase === 10 &&
        state.calendarConfirmed &&
        (!state.proactive_suggestions || !state.proactive_suggestions.rawSuggestions)
      ) {
        // Use both onboarding and confirmed calendar data to generate suggestions
        const suggestions = await this.proactiveSuggestionEngine.generateProactiveSuggestions(
          {
            ...state.onboarding_context,
            confirmedEvents: state.confirmedEvents
          },
          freshConversation.user_name || ''
        );
        // Store suggestions in state
        state.proactive_suggestions = suggestions;
        state.currentSuggestionIndex = 0;
        await this.supabase
          .from('conversations')
          .update({ phase_completion_status: state })
          .eq('id', conversation.id);

        // Present the first suggestion (one at a time)
        const followUp = await this.proactiveSuggestionEngine.generateFollowUpResponse(
          '', // No user response yet
          suggestions.rawSuggestions || [],
          suggestions.userInsights || {},
          freshConversation.user_name || '',
          { currentSuggestionIndex: 0 }
        );
        return {
          text: followUp.message,
          currentPhase: 10,
          phaseCompleted: true,
          nextPhase: 10,
          milestone: { onboardingComplete: true, calendarConsentRequested: true, calendarAnalyzed: true, calendarConfirmed: true, proactiveSuggestionsGenerated: true },
          proactiveSuggestions: suggestions
        };
      }
      // If onboarding is complete and proactive suggestions exist, resume suggestions flow
      if (currentPhase === 10 && state.onboarding_completed && state.proactive_suggestions) {
        // Use shared Claude-powered intent/event extraction
        const { intent, events } = await getIntentAndEventsFromClaude(userMessage, freshConversation, {
          intents: [
            'see_suggestions',
            'schedule_event',
            'reminder',
            'connect_calendar',
            'view_calendar',
            'calendar_planning',
            'event_scheduling',
            'adhd_support',
            'greeting',
            'general'
          ]
        });
        if (intent === 'see_suggestions') {
          // Re-present suggestions
          let proactiveMessage = 'Here are your personalized suggestions! Which one would you like to schedule?';
          if (state.proactive_suggestions && state.proactive_suggestions.suggestions && state.proactive_suggestions.suggestions.message) {
            proactiveMessage = state.proactive_suggestions.suggestions.message;
          } else if (state.proactive_suggestions && state.proactive_suggestions.message) {
            proactiveMessage = state.proactive_suggestions.message;
          }
          const currentSuggestionIndex = state.currentSuggestionIndex || 0;
          const followUp = await this.proactiveSuggestionEngine.generateFollowUpResponse(
            userMessage,
            state.proactive_suggestions.rawSuggestions || [],
            state.proactive_suggestions.userInsights || {},
            freshConversation.user_name || '',
            { currentSuggestionIndex }
          );
          // Update currentSuggestionIndex in state and persist to DB
          state.currentSuggestionIndex = followUp.currentSuggestionIndex;
          await this.supabase
            .from('conversations')
            .update({ phase_completion_status: state })
            .eq('id', freshConversation.id);
          return {
            text: followUp.message,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else if (intent === 'schedule_event') {
          // Check for calendar connection
          const { data: userRow } = await this.supabase
            .from('users')
            .select('id, calendar_connected')
            .eq('id', freshConversation.user_id)
            .single();
          if (!userRow || !userRow.calendar_connected) {
            return {
              text: 'Before we can schedule, please connect your Google Calendar using this link: [Connect Calendar Link] 😊',
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
          // Proceed to scheduling logic (existing flow)
          return await this.handleProactiveSuggestionResponse(
            freshConversation.id,
            userMessage,
            { id: freshConversation.user_id, name: freshConversation.user_name },
            state.proactive_suggestions
          );
        } else if (intent === 'reminder') {
          // Handle reminder logic (customize as needed)
          return {
            text: 'What would you like to be reminded about? I can help you set up a reminder or nudge! 😊',
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else if (intent === 'connect_calendar') {
          // Generate actual OAuth URL for calendar connection
          const baseUrl = process.env.APP_URL || 'http://localhost:3000';
          const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
          
          return {
            text: `🔗 Perfect! Let's connect your Google Calendar so I can help you build a schedule that works with your brain!

${authUrl}

Once connected, I can:
• See your actual schedule and suggest improvements
• Help you protect your most important priorities
• Suggest buffer time and ADHD-friendly scheduling
• Work with your natural energy patterns

Click the link above and I'll be here waiting to help you create a calendar that celebrates who you are! ✨`,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else if (intent === 'view_calendar') {
          // Check if user has connected their calendar
          const { data: userRow } = await this.supabase
            .from('users')
            .select('id, calendar_connected')
            .eq('id', freshConversation.user_id)
            .single();
          
          if (!userRow || !userRow.calendar_connected) {
            const baseUrl = process.env.APP_URL || 'http://localhost:3000';
            const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
            
            return {
              text: `📅 I'd love to show you your calendar! First, let's connect your Google Calendar:

${authUrl}

Once connected, I can see your schedule and help you make it work better for you! 🧠💙`,
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
          
          // Fetch and display calendar events
          try {
            const events = await this.fetchGoogleCalendarEvents(userRow.id);
            if (events.length === 0) {
              return {
                text: "📅 Your calendar is beautifully empty! Perfect time to add some intentional plans. What would you like to schedule? 🌟",
                currentPhase: 10,
                phaseCompleted: true,
                nextPhase: 10,
                milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
                proactiveSuggestions: state.proactive_suggestions
              };
            }
            
            // Format events for display
            let summary = "📅 Here's your upcoming schedule:\n\n";
            events.slice(0, 10).forEach(event => {
              const eventDate = new Date(event.start);
              const dayKey = eventDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              });
              const timeStr = eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              summary += `**${dayKey} at ${timeStr}**\n${event.summary}\n\n`;
            });
            
            summary += "🧠 Want to add something, move things around, or talk about managing this schedule? I'm here! 💙";
            
            return {
              text: summary,
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          } catch (error) {
            return {
              text: "📅 I'm having trouble accessing your calendar right now. Try again in a moment! 🔄",
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
        } else if (intent === 'calendar_planning') {
          // Help user plan their calendar
          return {
            text: `🎯 Love the planning energy! Let's make your calendar work FOR you instead of against you.

What kind of planning would you like to do?
• **Weekly planning** - Let's look at your week ahead
• **Priority planning** - Focus on what matters most
• **Energy planning** - Work with your natural rhythms
• **Buffer planning** - Add protective time for your brain

Or tell me what's on your mind - I'm here to help! 💙`,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else if (intent === 'event_scheduling') {
          // Handle event scheduling using extracted events
          if (events.length === 0) {
            return {
              text: "I'd love to help you schedule something! Can you tell me what event you'd like to add to your calendar? 📅",
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
          
          // Check if user has connected their calendar
          const { data: userRow } = await this.supabase
            .from('users')
            .select('id, calendar_connected')
            .eq('id', freshConversation.user_id)
            .single();
          
          if (!userRow || !userRow.calendar_connected) {
            const baseUrl = process.env.APP_URL || 'http://localhost:3000';
            const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
            
            return {
              text: `I'd love to help you schedule that! First, let's connect your Google Calendar:

${authUrl}

Once connected, I can create events for you right in your calendar! ✨`,
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
          
          // Process the extracted events
          let eventText = "I found these potential events in your message:\n\n";
          events.forEach((event, index) => {
            eventText += `${index + 1}. **${event.rawText}** (${event.type})\n`;
          });
          eventText += "\nWould you like me to schedule any of these? Just tell me which one! 📅";
          
          return {
            text: eventText,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else if (intent === 'adhd_support') {
          // Provide ADHD-friendly support and encouragement
          const supportMessages = [
            "💙 I totally get it. You deserve strategies that work for you, not against you. Want to break this down into smaller, less overwhelming pieces? You've got this! 🧠",
            "🧠 Your brain is amazing, and you're doing great! Sometimes the best strategy is to be gentle with yourself. What feels most overwhelming right now?",
            "💪 You're not alone in this! Many people find that smaller steps and celebrating progress (no matter how small) makes a huge difference. What would feel like a win today?",
            "🌟 Remember: progress over perfection! Every step forward is worth celebrating. What's one tiny thing that would help you feel more in control?",
            "💙 I see you, and I believe in you! Sometimes the most powerful thing is just acknowledging that this is hard. What do you need most right now?"
          ];
          
          const randomMessage = supportMessages[Math.floor(Math.random() * supportMessages.length)];
          
          return {
            text: randomMessage,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else if (intent === 'greeting') {
          // Respond warmly to greetings
          const greetingMessages = [
            `👋 Hey there! I'm so glad you're here! How can I help you with your calendar today? 💙`,
            `🧠💙 Hi! I'm excited to help you build a calendar that works with your brain! What's on your mind?`,
            `✨ Hello! I'm here to help make your schedule work FOR you instead of against you. What would you like to tackle?`,
            `🌟 Hi! I love your energy! How can I help you with planning and scheduling today?`,
            `💙 Hey! I'm here to support you in creating a calendar system that actually sticks. What can we work on together?`
          ];
          
          const randomGreeting = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
          
          return {
            text: randomGreeting,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        } else {
          // Fallback: ask for clarification
          return {
            text: "I'm not sure what you'd like to do! Can you help me understand?\n\n• Schedule one of the suggestions\n• Modify something\n• Tell me what's on your mind\n• Take a break for now",
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        }
      }

      // Special case: Return users who completed onboarding but haven't connected calendar
      if (currentPhase === 10 && state.onboarding_completed && !state.calendarConsentRequested) {
        // Check if this is a return message (hi, hello, where were we, etc.)
        const returnMessagePatterns = [
          /^(hi|hello|hey|yo|sup|what's up|wassup)/i,
          /where.*we.*again/i,
          /what.*happening/i,
          /how.*going/i,
          /back.*again/i
        ];
        
        const isReturnMessage = returnMessagePatterns.some(pattern => pattern.test(userMessage));
        
        if (isReturnMessage) {
          // Generate actual OAuth URL
          const baseUrl = process.env.APP_URL || 'http://localhost:3000';
          const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
          
          return {
            text: `🎉 Welcome back! I'm so excited to see you again! 

I remember our amazing conversation about your priorities and values. We were just about to connect your Google Calendar so I can start making personalized, ADHD-friendly suggestions that honor what matters most to you.

🔗 **Connect your Google Calendar here:**
${authUrl}

✨ **What happens next:**
• I'll see your upcoming events (with your permission)
• I'll suggest smart scheduling that protects your priorities
• You'll always have control - approve, modify, or skip anything I suggest
• We'll build your schedule together, one step at a time

Ready to make your calendar work FOR you instead of against you? 💙`,
            currentPhase: 10,
            phaseCompleted: true,
            nextPhase: 10,
            milestone: { onboardingComplete: true, calendarConsentRequested: true },
            proactiveSuggestions: state.proactive_suggestions
          };
        }
      }

      // Special case: Return users who completed onboarding and consented but haven't connected calendar
      if (currentPhase === 10 && state.onboarding_completed && state.calendarConsentRequested) {
        // Check if this is a return message (hi, hello, where were we, etc.)
        const returnMessagePatterns = [
          /^(hi|hello|hey|yo|sup|what's up|wassup)/i,
          /where.*we.*again/i,
          /what.*happening/i,
          /how.*going/i,
          /back.*again/i
        ];
        
        const isReturnMessage = returnMessagePatterns.some(pattern => pattern.test(userMessage));
        
        if (isReturnMessage) {
          // Check if user has connected their calendar
          const { data: userRow } = await this.supabase
            .from('users')
            .select('id, calendar_connected')
            .eq('id', freshConversation.user_id)
            .single();
          
          if (!userRow || !userRow.calendar_connected) {
            // Generate actual OAuth URL for return users
            const baseUrl = process.env.APP_URL || 'http://localhost:3000';
            const authUrl = `${baseUrl}/auth/google?userId=${encodeURIComponent(freshConversation.user_id)}`;
            
            return {
              text: `🧠💙 Hey there! I'm so glad you're back! 

I remember our conversation about your priorities and I'm ready to help you make your calendar work with your brain, not against it.

🔗 **Let's connect your Google Calendar:**
${authUrl}

Once connected, I can:
• See your actual schedule and suggest improvements
• Help you protect your most important priorities
• Suggest buffer time and ADHD-friendly scheduling
• Work with your natural energy patterns

No pressure - just click the link when you're ready! I'll be here waiting to help you build a calendar that celebrates who you are. ✨`,
              currentPhase: 10,
              phaseCompleted: true,
              nextPhase: 10,
              milestone: { onboardingComplete: true, calendarConsentRequested: true },
              proactiveSuggestions: state.proactive_suggestions
            };
          }
        }
      }

      // Get user info for personalization
      const { data: user } = await this.supabase
        .from('users')
        .select('name, phone')
        .eq('id', userId)
        .single();

      logger.info(`🎯 Processing message in Phase ${currentPhase}, Step: ${state.onboardingStep || 'none'}`);

      // Handle onboarding flow (Phase 0)
      if (currentPhase === 0) {
        logger.info(`🔄 Routing to onboarding handler with step: ${state.onboardingStep}`);
        return await this.handleOnboarding(conversation, userMessage, user, state);
      }

      // Handle main phases 1-10
      logger.info(`🔄 Routing to main phases handler for Phase ${currentPhase}`);
      return await this.handleMainPhases(conversation, userMessage, user, currentPhase);

    } catch (error) {
      logger.error('❌ Error generating response:', error);
      return {
        text: "🧠💙 I'm having a moment! Can you try again in a bit?",
        currentPhase: conversation.current_phase || 0,
        phaseCompleted: false,
        nextPhase: conversation.current_phase || 0
      };
    }
  }

  async handleOnboarding(conversation, userMessage, user, state) {
    const onboardingStep = state.onboardingStep || 'name_collection';

    logger.info(`📋 Onboarding step: ${onboardingStep}`);

    switch (onboardingStep) {
      case 'name_collection':
        logger.info('👤 Processing name collection');
        return await this.handleNameCollection(conversation, userMessage, user);

      case 'name_confirmation':
        logger.info('✅ Processing name confirmation');
        return await this.handleNameConfirmation(conversation, userMessage, user, state);

      case 'process_explanation':
        logger.info('🎯 Processing bridge message response');
        return await this.handleProcessExplanation(conversation, userMessage, user, state);

      default:
        logger.info('🔄 Defaulting to name collection');
        return await this.handleNameCollection(conversation, userMessage, user);
    }
  }

  async handleNameCollection(conversation, userMessage, user) {
    // Use Claude AI to intelligently determine if they provided a name
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      system: `You are goodberry analyzing if the user provided their name. Look at their message and determine:

1. Did they provide a name? (Could be "Sarah", "I'm John", "My name is Maria Lopez", "Call me Alex", etc.)
2. If yes, what is the name exactly?
3. How confident are you? (high/medium/low)

IMPORTANT: Only consider it a name if they're actually telling you their name, not if they're asking questions or having a conversation.

Examples:
- "Sarah" → Name: Sarah, Confidence: high
- "I'm curious how this works" → No name
- "My name is John Smith" → Name: John Smith, Confidence: high  
- "Call me Alex" → Name: Alex, Confidence: high
- "hi there" → No name
- "I'm Maria" → Name: Maria, Confidence: high
- "sounds good" → No name

Respond with ONLY a JSON object:
{"hasName": true/false, "extractedName": "name or null", "confidence": "high/medium/low", "shouldConfirm": true/false}

Set shouldConfirm to true if confidence is medium/low or if the name seems unusual.`,
      messages: [
        {
          role: 'user',
          content: `User message: "${userMessage}"`
        }
      ]
    });

    try {
      const analysis = JSON.parse(response.content[0].text);

      if (analysis.hasName && analysis.extractedName) {
        // Clean up and format the name
        const cleanName = analysis.extractedName.replace(/[^a-zA-Z\s]/g, '').trim();
        const formattedName = cleanName.split(' ').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');

        if (formattedName.length > 0) {
          // If Claude is confident, proceed directly. If not, ask for confirmation.
          if (analysis.confidence === 'high' && !analysis.shouldConfirm) {
            logger.info(`🎯 Confidently detected name: ${formattedName} - Moving to bridge message!`);
            return await this.processConfirmedName(conversation, formattedName, userMessage);
          } else {
            // Ask for confirmation with a friendly approach
            logger.info(`🤔 Detected potential name: ${formattedName} - Asking for confirmation (confidence: ${analysis.confidence})`);

            const confirmResponse = await this.anthropic.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 100,
              system: `You are goodberry responding to someone who shared their name: "${formattedName}". Be conversational and warm.

If it's a unique/unusual name (3+ words, creative spelling, unusual combination):
- Acknowledge the uniqueness warmly ("What a cool/unique/awesome name!")
- Suggest using just the first name for simplicity 
- Example: "Wow, Curlysue Janepants Whorrall - that's such a unique name! I love it! 💫 Would you like me to just call you Curlysue to keep things simple? 😊"

If it's a normal 1-2 word name:
- Simple confirmation
- Example: "Perfect! Should I call you ${formattedName}? ✨"

Keep it under 60 words. Be genuinely warm and conversational, not robotic. Use emojis.`,
              messages: [
                {
                  role: 'user',
                  content: userMessage
                }
              ]
            });

            // Store the potential name for the next message
            await this.updateConversationState(conversation.id, {
              onboardingStep: 'name_confirmation',
              potentialName: formattedName,
              originalMessage: userMessage
            });

            return {
              text: confirmResponse.content[0].text,
              currentPhase: 0,
              phaseCompleted: false,
              nextPhase: 0
            };
          }
        }
      }
    } catch (error) {
      logger.error('❌ Error parsing name analysis:', error);
      // Fallback to asking for name
    }

    // No name detected - introduce goodberry and ask for name
    const introResponse = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 140,
      system: `You are goodberry meeting someone for the first time. ALWAYS first warmly acknowledge and reflect back what they shared - their greeting, their energy, their friendliness, their context, etc. Be genuine and responsive to their specific message.

Then introduce yourself as the AI calendar assistant that understands ADHD and builds calendars that stick, then ask for their name. Keep it under 80 words total for SMS. Use emojis and be warm.

Examples: 
- If they say "hi it's nice to meet you": "Hi there! It's so nice to meet you too! 🌟 I'm goodberry - your AI calendar assistant that understands ADHD and builds calendars that stick. What's your name? ✨"
- If they mention a friend: "So glad your friend connected us! 💫 I'm goodberry - your AI calendar assistant that understands ADHD and builds calendars that stick. What's your name? ✨"
- If they mention struggles: "I hear you on those struggles! 💜 I'm goodberry - your AI calendar assistant that understands ADHD... What's your name? 😊"
- If casual greeting: "Hey! 👋 I'm goodberry - your AI calendar assistant that understands ADHD and builds calendars that stick. What's your name? ✨"

CRITICAL: Always acknowledge their specific message first, then proceed. Be genuinely responsive to their tone and energy.`,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    return {
      text: introResponse.content[0].text,
      currentPhase: 0,
      phaseCompleted: false,
      nextPhase: 0
    };
  }

  async processConfirmedName(conversation, extractedName, originalMessage) {
    // Clean up and format the confirmed name
    const cleanName = extractedName.replace(/[^a-zA-Z\s]/g, '').trim();
    const formattedName = cleanName.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    if (formattedName.length > 1) {
      const firstName = formattedName.split(' ')[0];

      // Update user's name in database
      await this.supabase
        .from('users')
        .update({ name: formattedName })
        .eq('id', conversation.user_id);

      // Move to process explanation step
      await this.updateConversationState(conversation.id, {
        onboardingStep: 'process_explanation',
        userName: firstName,
        fullName: formattedName
      });

      logger.info(`🎯 Confirmed name ${formattedName} - Moving to bridge message!`);

      // Use Claude to create a warm, natural bridge message with name confirmation
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        system: `You are goodberry. The user's name is "${formattedName}" so address them as "${firstName}". Create a warm bridge message that:

1. Naturally acknowledges their name with genuine warmth
2. Expresses excitement about working together  
3. Explains the 10 conversation process briefly
4. Mentions it takes about 20 minutes total
5. Builds confidence that this system works
6. Asks if they're ready to start

Keep it under 320 characters for SMS. Be enthusiastic, personal, and encouraging. Use emojis appropriately.

Example tone: "Hi ${firstName}! 🌟 Perfect, I'm so excited to work with you! We'll have 10 focused conversations over about 20 minutes total to discover your rhythms and build an amazing calendar system that actually works for your brain! ✨ Ready to dive in? 🚀"

Make it natural and conversational, not robotic.`,
        messages: [
          {
            role: 'user',
            content: originalMessage
          }
        ]
      });

      return {
        text: response.content[0].text,
        currentPhase: 0,
        phaseCompleted: false,
        nextPhase: 0
      };
    }

    // If name is too short, ask for their name again
    return await this.askForNameAgain(conversation, "I didn't quite catch that");
  }

  async handleNameConfirmation(conversation, userMessage, user, state) {
    const potentialName = state.potentialName;

    // Use Claude AI to understand their response to the name confirmation
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      system: `You are analyzing the user's response to confirm their name. 

Context: You asked about their name "${potentialName}" and they responded: "${userMessage}"

This could be:
1. Confirming the full name
2. Agreeing to use just first name (if you suggested it for a unique name)
3. Providing a different name entirely
4. Denying and asking to be called something else

Determine:
1. Did they confirm using the name/first name you suggested? (yes/no)
2. Did they provide a different name they want to be called? (if so, what is it?)
3. Did they reject it entirely? (yes/no)

Examples:
- "yes" → confirmed: true, newName: null, rejected: false
- "just call me Curlysue" → confirmed: true, newName: "Curlysue", rejected: false
- "no, it's Sarah" → confirmed: false, newName: "Sarah", rejected: true
- "actually call me Mike" → confirmed: false, newName: "Mike", rejected: true
- "that works" → confirmed: true, newName: null, rejected: false
- "nope, I'm Jessica" → confirmed: false, newName: "Jessica", rejected: true

Respond with ONLY a JSON object:
{"confirmed": true/false, "newName": "name or null", "rejected": true/false}`,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    try {
      const analysis = JSON.parse(response.content[0].text);

      if (analysis.confirmed) {
        // They confirmed the name, use it
        if (analysis.newName) {
          // They confirmed but want to use a specific name (like first name only)
          const cleanNewName = analysis.newName.replace(/[^a-zA-Z\s]/g, '').trim();
          return await this.processConfirmedName(conversation, cleanNewName, userMessage);
        } else {
          // They confirmed the original name
          return await this.processConfirmedName(conversation, potentialName, state.originalMessage);
        }
      } else if (analysis.rejected && !analysis.newName) {
        // They said no but didn't provide a new name, ask for their real name
        return await this.askForNameAgain(conversation, "Got it! What should I call you then?");
      } else if (analysis.newName) {
        // They provided a different name (whether they rejected or not)
        const cleanNewName = analysis.newName.replace(/[^a-zA-Z\s]/g, '').trim();
        return await this.processConfirmedName(conversation, cleanNewName, userMessage);
      } else {
        // Unclear response, ask again for clarification
        return await this.askForNameAgain(conversation, "I want to make sure I get your name right! What should I call you?");
      }
    } catch (error) {
      logger.error('❌ Error parsing name confirmation:', error);
      // Fallback - if they provided something that looks like a name
      if (userMessage.trim().split(' ').length <= 2 && /^[A-Za-z\s]+$/.test(userMessage.trim()) && userMessage.trim().length > 1) {
        return await this.processConfirmedName(conversation, userMessage.trim(), userMessage);
      } else {
        // Ask again for clarification
        return await this.askForNameAgain(conversation, "I want to make sure I get your name right! What should I call you?");
      }
    }
  }

  async askForNameAgain(conversation, prompt) {
    // Reset to name collection
    await this.updateConversationState(conversation.id, {
      onboardingStep: 'name_collection'
    });

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 80,
      system: `You are goodberry. ${prompt} Ask for their name in a warm, friendly way. Keep it under 40 words. Use emojis.

Examples:
- "What should I call you? 😊"  
- "What's your name? ✨"
- "I want to get your name right! What should I call you? 💫"

Be warm and direct.`,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return {
      text: response.content[0].text,
      currentPhase: 0,
      phaseCompleted: false,
      nextPhase: 0
    };
  }

  async handleProcessExplanation(conversation, userMessage, user, state) {
    // Use first name from state, or extract first name from user.name, or default to 'friend'
    const userName = state.userName || (user.name ? user.name.split(' ')[0] : 'friend');

    logger.info(`🎯 ${userName} responded with: "${userMessage}" - Moving to Phase 1!`);

    // ANY response after process explanation moves to Phase 1
    await this.updateConversationState(conversation.id, { onboardingStep: 'complete' });
    const { error: updateError } = await this.supabase
      .from('conversations')
      .update({ current_phase: 1 })
      .eq('id', conversation.id);

    if (updateError) {
      logger.error('❌ Error updating conversation to Phase 1:', updateError);
    } else {
      logger.info('✅ Successfully moved to Phase 1 after bridge message');
    }

    // Use Claude AI for energetic first conversation start with natural importance explanation
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 220,
      system: `You are goodberry starting the first conversation with ${userName}. They just agreed to start! Keep under 400 characters for SMS.

CRITICAL: This is conversation 1 of 10 - Brain Dump. ${userName} said "${userMessage}" which means they're ready to start. Be excited and immediately launch into the first conversation. NO uncertainty or hesitation detection whatsoever!

Respond with excitement: "Perfect ${userName}! 🎉 Let's dive into our first conversation!

🧠 Conversation 1: Brain Dump ✨ You know that feeling when your mind is juggling everything at once? Getting it ALL out creates instant relief and becomes the foundation for your personalized calendar system!

What's been on your mind lately? Work stress, personal goals, random thoughts - just let it all flow! 💭

(9 more conversations to go - we've got this! 💪)"

Always respond enthusiastically and start the first conversation immediately. Never interpret hesitation.`,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    return {
      text: response.content[0].text,
      currentPhase: 1,
      phaseCompleted: false,
      nextPhase: 1,
      milestone: { phase1Started: true }
    };
  }

  async handleMainPhases(conversation, userMessage, user, currentPhase) {
    const phaseInfo = this.getPhaseInfo(currentPhase);
    const userName = user.name ? user.name.split(' ')[0] : 'friend';

    // Get conversation history for context
    const { data: messages } = await this.supabase
      .from('conversation_messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('message_order', { ascending: true })
      .limit(10);

    // Check if this is the first message in a new phase
    const phaseMessages = messages ? messages.filter(m => m.role === 'user') : [];
    const isNewPhase = phaseMessages.length === 0;

    // Check if phase should be completed first
    const phaseProgress = await this.assessPhaseProgress(conversation.id, currentPhase, userMessage);

    // Special handling for Phase 10 completion (onboarding complete)
    if (phaseProgress.isComplete && currentPhase === 10) {
      logger.info(`🎉 ONBOARDING COMPLETE! Generating proactive suggestions for ${userName}`);
      // Extract insights from the final message of Phase 10
      const currentPhaseInsights = await this.extractPhaseInsights(userMessage, currentPhase, userName);
      // Compile comprehensive journey insights from all phases
      const journeyInsights = await this.compileJourneyInsights(conversation.id, currentPhase);
      // Generate proactive suggestions based on onboarding insights (MOVED UP, and fallback if null)
      let suggestions = null;
      try {
        suggestions = await this.proactiveSuggestionEngine.generateProactiveSuggestions(
          journeyInsights,
          userName
        );
      } catch (err) {
        logger.error('❌ Error generating proactive suggestions:', err);
        suggestions = null;
      }
      // Store comprehensive phase completion data
      await this.handlePhaseCompletion(conversation.id, currentPhase, {
        currentPhaseInsights,
        assessmentData: phaseProgress,
        completionMessage: userMessage,
        journeyInsights,
        proactive_suggestions: suggestions
      });
      // Mark conversation as completed and store proactive suggestions
      await this.supabase
        .from('conversations')
        .update({
          current_phase: 10,
          status: 'completed',
          phase_completion_status: {
            ...conversation.phase_completion_status,
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
            journey_insights: journeyInsights,
            proactive_suggestions: suggestions
          }
        })
        .eq('id', conversation.id);
      // Defensive: fallback message if suggestions or suggestions.suggestions is undefined
      let proactiveMessage = '🎉 Onboarding complete! Ready to start building your calendar?';
      if (suggestions && suggestions.suggestions && suggestions.suggestions.message) {
        proactiveMessage = suggestions.suggestions.message;
      } else if (suggestions && suggestions.message) {
        proactiveMessage = suggestions.message;
      }
      return {
        text: proactiveMessage,
        currentPhase: 10,
        phaseCompleted: true,
        nextPhase: 10,
        milestone: { onboardingComplete: true, proactiveSuggestionsGenerated: true },
        proactiveSuggestions: suggestions
      };
    }

    // If phase is completed, transition to next phase
    if (phaseProgress.isComplete && currentPhase < 10) {
      const nextPhase = currentPhase + 1;
      const nextPhaseInfo = this.getPhaseInfo(nextPhase);

      logger.info(`🎯 Conversation ${currentPhase} completed! Transitioning to Conversation ${nextPhase}: ${nextPhaseInfo.name}`);

      // Extract insights from the final message of current phase
      const currentPhaseInsights = await this.extractPhaseInsights(userMessage, currentPhase, userName);

      // Compile comprehensive journey insights from all previous phases
      const journeyInsights = await this.compileJourneyInsights(conversation.id, currentPhase);

      // Store comprehensive phase completion data
      await this.handlePhaseCompletion(conversation.id, currentPhase, {
        currentPhaseInsights,
        assessmentData: phaseProgress,
        completionMessage: userMessage,
        journeyInsights
      });

      // Update to next phase
      await this.supabase
        .from('conversations')
        .update({ current_phase: nextPhase })
        .eq('id', conversation.id);

      // Calculate remaining conversations for encouragement
      const conversationsLeft = 10 - nextPhase;
      const progressEmoji = nextPhase <= 3 ? '🚀' : nextPhase <= 6 ? '💪' : nextPhase <= 8 ? '🌟' : '🎯';

      // Occasionally add a progress reminder (20% of the time)
      const showProgressReminder = Math.random() < 0.2;
      // Create context-aware transition message with reflective validation and seamless flow
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 400,
        system: `You are goodberry, helping ${userName} seamlessly move into Conversation ${nextPhase}: ${nextPhaseInfo.name}. Keep under 650 characters for SMS.

NEVER use phrases like "ADHD brains" or "ADHDers." Instead, use inclusive, person-first language such as "people with ADHD" or "folks with ADHD tendencies."

NEVER use phrases like "ADHD brains" or "ADHDers." Instead, use inclusive, person-first language such as "people with ADHD" or "folks with ADHD tendencies."

THEIR JOURNEY SO FAR:
${JSON.stringify(journeyInsights, null, 2).slice(0, 800)}

WHAT THEY JUST SHARED (Conversation ${currentPhase}):
"${userMessage}"

KEY INSIGHTS FROM THEIR ASSESSMENT:
${phaseProgress.keyInsights ? phaseProgress.keyInsights.join(', ') : 'See their overall journey'}

TASK: Create an ADHD-friendly, seamless transition that:
1. FIRST reflectively validate what they just shared - show you heard and understood their specific insights, challenges, or patterns 💜
2. Celebrate completion: "🎉 Amazing job finishing that!" (no need to say the conversation number)
3. In a natural, conversational way, say something like: "Now we're working on ${nextPhaseInfo.name}" or "Next up: ${nextPhaseInfo.name}" (avoid formal phase numbers)
4. Only occasionally (if showProgressReminder is true) mention how many conversations are left, e.g., "Just ${conversationsLeft} more to go!"
5. Explain WHY ${nextPhaseInfo.name} matters for THEIR specific situation, referencing what they just shared
6. Connect the dots: Show how this next conversation builds on their actual insights
7. Immediately ask the first question for the next phase (from: ${this.getPhaseGuidance(nextPhase)})
8. End with ADHD-friendly encouragement like "You're doing fantastic!" ${progressEmoji}

CRITICAL: Do NOT ask for confirmation or if they're ready. Just flow into the next question as a natural conversation would.

Be enthusiastic, validating, and make them feel heard before moving forward!`,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return {
        text: response.content[0].text,
        currentPhase: nextPhase,
        phaseCompleted: false,
        nextPhase: nextPhase,
        milestone: { [`phase${nextPhase}Started`]: true }
      };
    }

    // If it's a new conversation but not transitioning, naturally introduce it
    if (isNewPhase && currentPhase > 1) {
      // Get comprehensive journey context for personalized conversation introduction
      const journeyInsights = await this.compileJourneyInsights(conversation.id, currentPhase - 1);

      // Calculate remaining conversations for encouragement
      const conversationsLeft = 10 - currentPhase;
      const progressEmoji = currentPhase <= 3 ? '🚀' : currentPhase <= 6 ? '💪' : currentPhase <= 8 ? '🌟' : '🎯';

      logger.info(`🎯 Starting Conversation ${currentPhase}: ${phaseInfo.name} with journey context`);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 350,
        system: `You are goodberry starting Conversation ${currentPhase}: ${phaseInfo.name} with ${userName}. Keep under 600 characters for SMS.

NEVER use phrases like "ADHD brains" or "ADHDers." Instead, use inclusive, person-first language such as "people with ADHD" or "folks with ADHD tendencies."

THEIR JOURNEY INSIGHTS:
${JSON.stringify(journeyInsights, null, 2).slice(0, 600)}

WHAT THEY JUST SHARED:
"${userMessage}"

TASK: Create an ADHD-friendly conversation introduction that:
1. FIRST reflectively validates what they just shared - show you heard and understood their specific insights, challenges, or patterns 💜
2. Gets excited: "Let's dive into conversation ${currentPhase}!"
3. Shows progress: "Just ${conversationsLeft} more conversations after this one!" 
4. Explains why ${phaseInfo.name} is crucial for THEIR unique situation, referencing what they just shared
5. Shows how this builds on their actual journey patterns and insights
6. Ends with encouragement like "You're crushing this!" ${progressEmoji}
7. Then asks an engaging first question

CRITICAL: Always reflect back something specific they shared before introducing the new conversation.

Conversation ${currentPhase} guidance: ${this.getPhaseGuidance(currentPhase)}

Be enthusiastic, validating, and make them feel heard before moving to the new topic!`,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return {
        text: response.content[0].text,
        currentPhase: currentPhase,
        phaseCompleted: false,
        nextPhase: currentPhase
      };
    }

    // Get conversation history to personalize importance explanations
    let conversationContext = '';
    if (messages && messages.length > 0) {
      const userMsgs = messages.filter(m => m.role === 'user').map(m => m.content);
      const assistantMsgs = messages.filter(m => m.role === 'assistant').map(m => m.content);
      const bullets = [];
      if (userMsgs.length > 0) {
        bullets.push(...userMsgs.slice(-3).map(msg => `- User shared: ${msg}`));
      }
      if (assistantMsgs.length > 0) {
        bullets.push(...assistantMsgs.slice(-2).map(msg => `- Assistant replied: ${msg}`));
      }
      if (bullets.length > 0) {
        conversationContext = `Key facts from recent conversation:\n${bullets.join('\n')}`;
      }
    }

    // Calculate remaining conversations and add occasional encouragement
    const conversationsLeft = 10 - currentPhase;
    const shouldAddProgressEncouragement = Math.random() < 0.3; // 30% chance for progress reminder

    // Special handling for Phase 5 - be proactive about suggesting work/personal split
    if (currentPhase === 5) {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 350,
        system: `You are goodberry in Conversation ${currentPhase}: ${phaseInfo.name} with ${userName}. Keep responses under 200 words for SMS.

NEVER use phrases like "ADHD brains" or "ADHDers." Instead, use inclusive, person-first language such as "people with ADHD" or "folks with ADHD tendencies."

Below is conversation history for context only. NEVER repeat, echo, or guess any of these lines. NEVER include lines starting with "user:" or "assistant:" in your reply. Only respond as goodberry (lowercase g) to the most recent user message. Never refer to yourself as Goodberry or any other persona.

${conversationContext}

IMPORTANT: The above lines are for context only. Do NOT repeat or echo any lines that start with "user:" or "assistant:" in your reply. Only use them to inform your response.

PHASE 5 SPECIAL INSTRUCTIONS:
1. FIRST reflectively validate what they just shared about energizing activities and values
2. PROACTIVELY suggest a work/personal split based on what they've shared. Use patterns like:
   - "Based on what you've shared about [specific activities], I think we'll start with a [X/Y] work/personal split and adjust as we go."
   - "Given your love for [activities] and need for [values], [X/Y] seems like a good starting point."
3. Be confident and specific with the split (like 70/30, 60/40, 55/45)
4. ALWAYS add reassurance: "If we need to adjust this later, we can totally do that. This will get us off to a good start."
5. Immediately move to exploring the "why" behind their top priorities
6. Ask about deeper values and meaning, not percentages

Be natural, validating, and confidently move the conversation forward!`,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      // Extract and store insights from user message
      const insights = await this.extractPhaseInsights(userMessage, currentPhase, userName);

      // Extract AI-suggested split from the response
      const aiResponse = response.content[0].text;
      const splitInsights = await this.extractAISuggestedSplit(aiResponse, insights);
      if (splitInsights) {
        Object.assign(insights, splitInsights);
      }

      // Store insights in database after each user message
      await this.storeInsights(conversation.id, insights, null);

      return {
        text: response.content[0].text,
        currentPhase: currentPhase,
        phaseCompleted: false,
        nextPhase: currentPhase,
        insights: insights
      };
    }

    // Special handling for Phase 8 - focus on ADHD tax tasks
    if (currentPhase === 8) {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 350,
        system: `You are goodberry in Conversation ${currentPhase}: ${phaseInfo.name} with ${userName}. Keep responses under 200 words for SMS.

NEVER use phrases like "ADHD brains" or "ADHDers." Instead, use inclusive, person-first language such as "people with ADHD" or "folks with ADHD tendencies."

Below is conversation history for context only. NEVER repeat, echo, or guess any of these lines. NEVER include lines starting with "user:" or "assistant:" in your reply. Only respond as goodberry (lowercase g) to the most recent user message. Never refer to yourself as Goodberry or any other persona.

${conversationContext}

IMPORTANT: The above lines are for context only. Do NOT repeat or echo any lines that start with "user:" or "assistant:" in your reply. Only use them to inform your response.

PHASE 8 SPECIAL INSTRUCTIONS:
1. FIRST reflectively validate what they just shared about their scheduling preferences
2. FOCUS ON ADHD TAX TASKS: Ask about specific administrative/bureaucratic tasks that are disproportionately difficult for people with ADHD
3. Use specific examples: bills, taxes, forms, registrations, appointments, paperwork, insurance, legal documents, renewals, applications
4. Ask about why these tasks feel overwhelming or difficult
5. Explore how to make them less awful through timing, rewards, or breaking them down

Be natural, validating, and focus on the specific ADHD tax challenges!`,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      // Extract and store insights from user message
      const insights = await this.extractPhaseInsights(userMessage, currentPhase, userName);

      // Store insights in database after each user message
      await this.storeInsights(conversation.id, insights, null);

      return {
        text: response.content[0].text,
        currentPhase: currentPhase,
        phaseCompleted: false,
        nextPhase: currentPhase,
        insights: insights
      };
    }

    // ALWAYS explain why this conversation matters, but make it natural based on their journey
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 280,
      system: `You are goodberry in Conversation ${currentPhase}: ${phaseInfo.name} with ${userName}. Keep responses under 160 words for SMS. 

NEVER use phrases like "ADHD brains" or "ADHDers." Instead, use inclusive, person-first language such as "people with ADHD" or "folks with ADHD tendencies."

Below is conversation history for context only. NEVER repeat, echo, or guess any of these lines. NEVER include lines starting with "user:" or "assistant:" in your reply. Only respond as goodberry (lowercase g) to the most recent user message. Never refer to yourself as Goodberry or any other persona.

${conversationContext}

IMPORTANT: The above lines are for context only. Do NOT repeat or echo any lines that start with "user:" or "assistant:" in your reply. Only use them to inform your response.

TASK: Create a response that:
1. FIRST reflectively validates what they just shared - show you heard and understood their specific insights, challenges, or patterns 💜
2. Naturally connects why ${phaseInfo.name} matters for THEIR specific situation
3. References their actual journey insights to make it personal and relevant
4. Asks ONE caring follow-up question: ${this.getPhaseGuidance(currentPhase)}

${currentPhase === 5 ? 'PHASE 5 SPECIAL: Proactively suggest a work/personal split based on what they\'ve shared, then immediately explore the "why" behind their top priorities. Be confident and move forward without asking for confirmation.' : ''}

${shouldAddProgressEncouragement ? `Occasionally add ADHD-friendly encouragement like "You're doing great! Just ${conversationsLeft} more conversations to go!" or "We're making amazing progress together!" 💪` : ''}

CRITICAL: Always reflect back something specific they shared before asking the next question. Don't just jump to the next topic.

Be natural, validating, personal, and make them feel heard!`,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // Extract and store insights from user message (for non-Phase 5)
    const insights = await this.extractPhaseInsights(userMessage, currentPhase, userName);

    // Store insights in database after each user message
    if (insights && Object.keys(insights).length > 0) {
      await this.storeInsights(conversation.id, insights, phaseProgress);
    }

    return {
      text: response.content[0].text,
      currentPhase: currentPhase,
      phaseCompleted: phaseProgress.isComplete,
      nextPhase: phaseProgress.isComplete ? Math.min(currentPhase + 1, 10) : currentPhase,
      insights: insights
    };
  }

  getPhaseInfo(phase) {
    const phases = {
      1: { name: "Brain Dump & Discovery", purpose: "Get everything out of your head safely" },
      2: { name: "Organization", purpose: "Sort work vs personal priorities" },
      3: { name: "ADHD Patterns", purpose: "Understand what planning approaches work for you" },
      4: { name: "Energy Patterns", purpose: "Identify when you're most/least effective" },
      5: { name: "Values & Joy", purpose: "Discover what energizes vs drains you" },
      6: { name: "Constraints & Reality", purpose: "Understand what you're realistically working with" },
      7: { name: "Calendar Preferences", purpose: "How you actually like to schedule things" },
      8: { name: "ADHD Tax Transformation", purpose: "Turn boring tasks into energizing plans" },
      9: { name: "Systematic Ranking", purpose: "Prioritize everything with confidence" },
      10: { name: "Calendar Building", purpose: "Create your personalized, sustainable system" }
    };

    return phases[phase] || { name: "Unknown Phase", purpose: "Continue the journey" };
  }

  getPhaseImportance(phase) {
    const importance = {
      1: "This brain dump is pure magic! 🧠✨ Your brilliant mind is juggling SO much right now, and when thoughts swirl inside, we can't breathe clearly. Getting everything OUT creates instant relief and space for clarity! This becomes the beautiful foundation we build your entire personalized system on 💫",

      2: "Now we organize that gorgeous chaos! 🌈 Without honoring both your work AND personal life, we'd create a calendar that burns you out. This phase ensures we build something that celebrates ALL of you - your career dreams AND your soul's needs! 💼💜",

      3: "This is where we discover your unique brilliance! 🧬 Your brain works differently than others, and that's your SUPERPOWER! Understanding your natural patterns means we build a calendar that flows with your authentic self, not against it. No more fighting yourself! 🦋",

      4: "Energy patterns are your secret weapon! ⚡ When we know your natural rhythms - when you sparkle vs when you need gentleness - we can schedule your life to work WITH your energy, not drain it. This changes everything! 🌟",

      5: "Values and joy are what make this sustainable! 💖 Without knowing what lights you up vs drains your soul, we'd build a perfectly organized prison. This phase ensures your calendar actually energizes and inspires you every single day! ✨",

      6: "Reality check with love! 🤗 We need to honor your real life - your actual time, resources, and circumstances. This isn't limiting you; it's creating a foundation that actually WORKS for your beautiful, complex reality! 🌍",

      7: "Your scheduling preferences matter SO much! 📅💕 Some people love detailed structure, others need breathing room. This phase ensures your calendar feels like a warm hug, not a straightjacket. We're designing YOUR perfect fit! 🎯",

      8: "ADHD tax transformation is life-changing! 🎭✨ Those administrative tasks that others find simple but feel overwhelming to you? Bills, forms, registrations, paperwork - we're about to turn them into manageable wins. Your future self will thank us for this magic! No more suffering through bureaucratic stuff! 🌈",

      9: "This is where it all comes together! 🎪 We take everything beautiful we've discovered about you and create crystal-clear priorities that align with your authentic self. No more confusion - just clarity and confidence! 💎",

      10: "THE BIG MOMENT! 🎉 We're creating your personalized life operating system using everything we've learned about your energy, values, constraints, and dreams. This becomes the calendar that finally WORKS for your amazing brain! 🚀💫"
    };

    return importance[phase] || "This phase continues building your personalized calendar system with love! 💜";
  }

  getPhaseGuidance(phase) {
    const guidance = {
      1: "Help them brain dump everything - work, personal, random thoughts. Don't organize yet, just get it all out. Ask follow-up questions like 'What else is on your mind?' or 'Any work deadlines you're thinking about?'",
      2: "Now help organize what they shared into categories (work, personal, health, family). Ask them to identify which category feels most overwhelming right now.",
      3: "Explore what planning methods they've tried before - apps, planners, lists. What worked? What didn't? Why? Look for patterns in their preferences.",
      4: "Identify their natural energy patterns. When do they feel most focused? Most drained? After meals? Exercise? Ask specific questions about their daily rhythms.",
      5: "CRITICAL: First discover what truly energizes vs drains them. Then proactively suggest a work/personal split based on what they've shared. Say something like 'Based on what you've shared about [specific activities/values], I think we'll start with a [X/Y] work/personal split and adjust as we go.' Then immediately move to exploring the 'why' behind their top priorities - what deeper values do these activities serve? Don't ask for confirmation - be confident and move forward.",
      6: "Get realistic about their constraints - time, money, family obligations, health considerations. What are their non-negotiables? What flexibility do they have?",
      7: "Understand how they prefer to schedule things. Do they like time-blocking? Loose planning? Detailed schedules? Back-to-back meetings or buffer time?",
      8: "CRITICAL: Focus on identifying specific administrative/bureaucratic tasks that are disproportionately difficult for people with ADHD. Ask about: bills, taxes, forms, registrations, appointments, paperwork, insurance, legal documents, renewals, applications. These are the 'ADHD tax' tasks that others find simple but can be overwhelming. Then explore how to make them less awful through timing, rewards, or breaking them down.",
      9: "Now systematically rank everything using their values, energy patterns, constraints, and seasonal relevance. Help them see clear priorities emerge.",
      10: "CRITICAL: This is calendar integration AND system building time! First, ask about their current calendar (Google, Outlook, iCal), if they're using it, and what's in there. Then offer to connect and see their existing events to confirm patterns we've discovered. Finally, discuss their system structure preferences, integration plans, success metrics, and maintenance strategy. This is where we actually build their personalized calendar system!"
    };

    return guidance[phase] || "Continue guiding them through this phase with encouraging questions.";
  }

  async extractAISuggestedSplit(aiResponse, existingInsights) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        system: `Extract the AI-suggested work/personal split from this response. Look for patterns like:
- "I think we'll start with a [X/Y] work/personal split"
- "Based on what you've shared, [X/Y] seems right"
- "Let's try [X/Y] for work/personal"

Return ONLY a JSON object:
{
  "ai_suggested_work_percentage": number,
  "ai_suggested_personal_percentage": number,
  "split_suggested": true/false,
  "split_reasoning": "brief explanation of why this split was suggested"
}

If no split is found, return:
{
  "split_suggested": false
}`,
        messages: [
          {
            role: 'user',
            content: `AI Response: "${aiResponse}"`
          }
        ]
      });

      try {
        return JSON.parse(response.content[0].text);
      } catch {
        return { split_suggested: false };
      }
    } catch (error) {
      logger.error('❌ Error extracting AI suggested split:', error);
      return { split_suggested: false };
    }
  }

  async extractPhaseInsights(userMessage, currentPhase, userName) {
    // Instead of mapping a/b/c or keywords, always send the user's message to Claude for intelligent option matching
    // For phases with explicit options, add to the system prompt:
    // "If the user's message matches or implies one of the options, return a field 'selected_option' with the value (e.g., 'a', 'b', 'c', or the full text)."
    let patchedMessage = userMessage;
    let optionsPrompt = '';
    if (currentPhase === 7) { // Example: calendar preferences phase
      optionsPrompt = `\nOptions presented to the user were:\na) block dedicated time slots for specific activities (like 'disc golf thursdays')\nb) have flexible categories of time (like 'outdoor recreation' that could be fishing/disc golf/hiking)\nIf the user's message matches or implies one of these, return a field 'selected_option' with the value ('a' or 'b').`;
    }
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        system: `Extract structured insights from ${userName}'s message for Phase ${currentPhase}. Return a JSON object with relevant fields based on the phase:${optionsPrompt}\nOnly include fields with actual content. If nothing relevant is mentioned, return empty object.`,
        messages: [
          {
            role: 'user',
            content: `Phase ${currentPhase} message: "${patchedMessage}"`
          }
        ]
      });
      try {
        const aiResult = JSON.parse(response.content[0].text);
        // If Claude returns a selected_option, you can use it to drive logic elsewhere
        return aiResult;
      } catch {
        // Fallback to basic insights if JSON parsing fails
        return {
          message_content: patchedMessage,
          phase: currentPhase,
          extracted_keywords: patchedMessage.toLowerCase().split(' ').filter(word => word.length > 3),
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      logger.error('❌ Error extracting phase insights:', error);
      return {
        message_content: patchedMessage,
        phase: currentPhase,
        error: 'insight_extraction_failed'
      };
    }
  }

  async assessPhaseProgress(conversationId, currentPhase, userMessage) {
    // Get all messages in this phase to assess completion
    const { data: phaseMessages } = await this.supabase
      .from('conversation_messages')
      .select('content, role')
      .eq('conversation_id', conversationId)
      .order('message_order', { ascending: true });

    const userMessages = phaseMessages ? phaseMessages.filter(m => m.role === 'user').map(m => m.content) : [];
    const messageCount = userMessages.length;
    const totalContent = userMessages.join(' | ');

    // Only require at least 1 user message to assess
    if (messageCount < 1) {
      return {
        isComplete: false,
        messageCount: messageCount,
        totalContent: totalContent.length,
        readyForNext: false,
        reason: 'No user messages yet'
      };
    }

    // Check if this is just a process question (not actual content)
    const processQuestions = [
      'what is', 'what are', 'what will', 'can you tell me', 'can you explain',
      'how does', 'how will', 'what happens', 'what comes next', 'what topics',
      'roadmap', 'structure', 'conversations', 'overview'
    ];

    const isProcessQuestion = processQuestions.some(q => userMessage.toLowerCase().includes(q));

    if (isProcessQuestion) {
      return {
        isComplete: false,
        messageCount: messageCount,
        totalContent: totalContent.length,
        readyForNext: false,
        reason: 'User asking process questions, not providing actual content for this conversation'
      };
    }

    // Use Claude AI to intelligently assess completion with clear success criteria
    try {
      const phaseInfo = this.getPhaseInfo(currentPhase);
      const phaseGuidance = this.getPhaseGuidance(currentPhase);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 400,
        system: `You are assessing if Conversation ${currentPhase}: ${phaseInfo.name} should be completed. Use the success criteria below as guidelines, but trust your judgment about meaningful engagement.

ADHD CONVERSATION SUCCESS CRITERIA:

**Conversation 1 - Brain Dump:** 
- 4+ distinct life areas mentioned with emotional weight
- At least 2 items with emotional significance ("stressful", "excited about")
- User shows relief/energy after sharing
- Mentions scattered thoughts or feeling overwhelmed
- GUIDELINE: 4+ distinct items, 200+ characters, emotional engagement

**Conversation 2 - Organization:**
- Clear work vs personal categorization
- 3+ life areas organized
- User identifies most overwhelming area
- Shows preference for organizational thinking
- GUIDELINE: 3+ categories, 150+ characters, overwhelm identification

**Conversation 3 - ADHD Patterns:**
- 2+ past system attempts described
- Clear what worked vs failed understanding
- Specific ADHD challenges mentioned
- Shows self-awareness of patterns
- GUIDELINE: 2+ past attempts, 150+ characters, pattern recognition

**Conversation 4 - Energy Patterns:**
- Specific times of day mentioned
- 2+ energy triggers identified
- Clear high/low energy periods
- Mentions medication effects or focus windows
- GUIDELINE: 2+ energy patterns, 150+ characters, temporal awareness

**Conversation 5 - Values & Joy:** ⚠️ CRITICAL FOUNDATION
- 3+ core values with examples
- Clear energizing vs draining understanding
- AI suggests work/personal split based on user's shared values and activities
- Values feel personally meaningful, not generic
- User shows understanding of why this balance matters
- GUIDELINE: 3+ values, AI-suggested split, 200+ characters

**Conversation 6 - Constraints:**
- Time, energy, and resource constraints identified
- Clear non-negotiables
- Understanding of flexibility areas
- Mentions ADHD-specific limitations
- GUIDELINE: 3+ constraint types, 150+ characters, boundary awareness

**Conversation 7 - Calendar Preferences:**
- Scheduling style preference (structured vs flexible)
- Specific buffer time needs
- Meeting style preferences
- References past scheduling successes
- GUIDELINE: 2+ preference types, 150+ characters, style clarity

**Conversation 8 - ADHD Tax:**
- 3+ administrative/bureaucratic tasks identified (bills, forms, registrations, etc.)
- Clear understanding of why these are disproportionately difficult
- Specific transformation strategies (timing, rewards, breaking down)
- Recognition of ADHD-specific challenges with these tasks
- GUIDELINE: 3+ ADHD tax tasks, 150+ characters, transformation strategies

**Conversation 9 - Ranking:**
- Clear top 3-5 priorities
- Ranking criteria explained
- Trade-offs acknowledged
- Values alignment shown
- GUIDELINE: 3+ priorities, 200+ characters, ranking logic

**Conversation 10 - Calendar Building:**
- Calendar type identified (Google, Outlook, iCal, etc.)
- Current calendar usage assessed
- Connection permission requested
- Real calendar events suggested or created
- Integration with discovered patterns confirmed
- Clear system structure preferences defined
- Integration plans established
- Success metrics defined
- Maintenance strategy created
- MINIMUM: Calendar type identified, connection discussed, system preferences, 150+ characters

ASSESSMENT CONTEXT:
All user messages in this conversation: "${totalContent}"
Latest message: "${userMessage}"
Current phase: ${currentPhase}

ADHD-SPECIFIC CONSIDERATIONS:
- Look for emotional engagement, not just information sharing
- Check for self-awareness and pattern recognition
- Ensure values feel personally meaningful, not generic
- Verify user shows relief/energy from the conversation process
- Confirm ADHD-specific insights and challenges mentioned
- Trust your judgment - if they're meaningfully engaged, they're likely ready

Respond with ONLY a JSON object:
{
  "isComplete": true/false,
  "confidence": 0.1-1.0,
  "reason": "detailed explanation of why they have/haven't met the success criteria",
  "keyInsights": ["insight1", "insight2"],
  "adhdPatterns": ["pattern1", "pattern2"],
  "emotionalEngagement": "high/medium/low",
  "recommendation": "continue/transition/need_more"
}

Use the success criteria as guidelines, but trust your judgment about meaningful engagement.`,
        messages: [
          {
            role: 'user',
            content: `Conversation ${currentPhase} assessment needed. Latest: "${userMessage}"`
          }
        ]
      });

      try {
        const assessment = JSON.parse(response.content[0].text);

        // Use Claude's assessment with flexible confidence thresholds
        const confidenceThresholds = {
          1: 0.6,  // Brain Dump - Foundation phase (more lenient)
          2: 0.6,  // Organization (more lenient)
          3: 0.6,  // ADHD Patterns (more lenient)
          4: 0.6,  // Energy Patterns (more lenient)
          5: 0.7,  // Values & Joy - Critical foundation
          6: 0.6,  // Constraints (more lenient)
          7: 0.6,  // Calendar Preferences (more lenient)
          8: 0.6,  // ADHD Tax (more lenient)
          9: 0.7,  // Ranking - Important for system
          10: 0.6  // Calendar Building (more lenient)
        };
        const confidenceThreshold = confidenceThresholds[currentPhase] || 0.6;

        return {
          isComplete: assessment.isComplete && assessment.confidence >= confidenceThreshold,
          messageCount: messageCount,
          totalContent: totalContent.length,
          readyForNext: assessment.isComplete && assessment.confidence >= confidenceThreshold,
          confidence: assessment.confidence,
          reason: assessment.reason,
          keyInsights: assessment.keyInsights || [],
          adhdPatterns: assessment.adhdPatterns || [],
          emotionalEngagement: assessment.emotionalEngagement || 'medium',
          aiAssessment: true
        };
      } catch (parseError) {
        logger.error('❌ Error parsing AI phase assessment:', parseError);
        // Only use fallback if Claude completely fails
        return this.assessPhaseProgressFallback(currentPhase, messageCount, totalContent, userMessage);
      }
    } catch (error) {
      logger.error('❌ Error in AI phase assessment:', error);
      // Fallback to simple heuristics only if Claude fails
      return this.assessPhaseProgressFallback(currentPhase, messageCount, totalContent, userMessage);
    }
  }

  assessPhaseProgressFallback(currentPhase, messageCount, totalContent, userMessage) {
    // Ultra-lenient fallback - only use when Claude completely fails
    // Trust that if the user is engaged and sharing content, they're making progress
    const emotionalEngagement = this.calculateEmotionalEngagement(userMessage, totalContent);

    // Very basic criteria - just ensure they're engaged and sharing meaningful content
    const isComplete = messageCount >= 2 && totalContent.length > 100 && emotionalEngagement !== 'low';

    return {
      isComplete: isComplete,
      messageCount: messageCount,
      totalContent: totalContent.length,
      readyForNext: isComplete,
      fallback: true,
      emotionalEngagement: emotionalEngagement,
      reason: isComplete ? 'Claude AI failed, but user appears engaged and sharing content' : 'Claude AI failed, continuing conversation to gather more content'
    };
  }

  calculateEmotionalEngagement(message, totalContent) {
    const positiveIndicators = ['relief', 'excited', 'energized', 'understood', 'validated', 'good', 'great', 'awesome', 'love', 'amazing', 'perfect', 'yes', 'absolutely'];
    const negativeIndicators = ['overwhelmed', 'stressed', 'frustrated', 'confused', 'bad', 'terrible', 'no', 'not', 'dont', 'cant', 'hard', 'difficult'];

    const positiveCount = positiveIndicators.filter(indicator =>
      message.toLowerCase().includes(indicator) || totalContent.toLowerCase().includes(indicator)
    ).length;

    const negativeCount = negativeIndicators.filter(indicator =>
      message.toLowerCase().includes(indicator) || totalContent.toLowerCase().includes(indicator)
    ).length;

    if (positiveCount > negativeCount + 1) return 'high';
    if (positiveCount > negativeCount) return 'medium';
    return 'low';
  }

  async updateConversationState(conversationId, newState) {
    const { data: current } = await this.supabase
      .from('conversations')
      .select('phase_completion_status')
      .eq('id', conversationId)
      .single();

    const updatedState = { ...current.phase_completion_status, ...newState };

    await this.supabase
      .from('conversations')
      .update({ phase_completion_status: updatedState })
      .eq('id', conversationId);
  }

  async storeMessage(conversationId, role, content) {
    try {
      // Get the next message order number
      const { data: lastMessage } = await this.supabase
        .from('conversation_messages')
        .select('message_order')
        .eq('conversation_id', conversationId)
        .order('message_order', { ascending: false })
        .limit(1)
        .single();

      const nextOrder = lastMessage ? lastMessage.message_order + 1 : 1;

      await this.supabase
        .from('conversation_messages')
        .insert([{
          conversation_id: conversationId,
          role: role,
          content: content,
          message_order: nextOrder
        }]);

      logger.info('💬 Stored conversation message');
    } catch (error) {
      logger.error('❌ Error storing message:', error);
    }
  }

  async storeInsights(conversationId, insights, assessmentData = null) {
    try {
      // Validate insights before storing
      if (!insights || typeof insights !== 'object' || Object.keys(insights).length === 0) {
        logger.info('⚠️ No meaningful insights to store');
        return;
      }

      // Get user_id for the conversation_extracts table
      const { data: conversation, error: conversationError } = await this.supabase
        .from('conversations')
        .select('user_id, current_phase')
        .eq('id', conversationId)
        .single();

      if (conversationError) {
        logger.error('❌ Error getting conversation for insights storage:', conversationError);
        return;
      }

      // Use Claude's confidence rating if available, otherwise calculate based on insight richness
      let confidenceScore;
      if (assessmentData && assessmentData.confidence) {
        confidenceScore = assessmentData.confidence;
      } else {
        const insightCount = Object.values(insights).flat().length;
        confidenceScore = Math.min(0.9, 0.3 + (insightCount * 0.1));
      }

      // Add assessment data to insights if available
      const enhancedInsights = {
        ...insights,
        assessment_confidence: confidenceScore,
        assessment_reason: assessmentData?.reason || null,
        emotional_engagement: assessmentData?.emotionalEngagement || null,
        adhd_patterns: assessmentData?.adhdPatterns || []
      };

      const { error: insertError } = await this.supabase
        .from('conversation_extracts')
        .insert([{
          conversation_id: conversationId,
          user_id: conversation.user_id,
          extract_type: 'claude_ai_insights',
          raw_content: JSON.stringify(enhancedInsights),
          structured_data: enhancedInsights,
          confidence_score: confidenceScore
        }]);

      if (insertError) {
        logger.error('❌ Error inserting insights:', insertError);
      } else {
        logger.info(`🧠 Stored insights (confidence: ${confidenceScore.toFixed(2)})`);
      }
    } catch (error) {
      logger.error('❌ Error storing intelligent insights:', error);
    }
  }

  async compileJourneyInsights(conversationId, currentPhase) {
    try {
      // Get all stored insights from conversation_extracts
      const { data: extractedInsights } = await this.supabase
        .from('conversation_extracts')
        .select('structured_data, created_at')
        .eq('conversation_id', conversationId)
        .eq('extract_type', 'claude_ai_insights')
        .order('created_at', { ascending: true });

      // Get phase completion data
      const { data: conversation } = await this.supabase
        .from('conversations')
        .select('phase_completion_status')
        .eq('id', conversationId)
        .single();

      // Compile journey insights by phase
      const journeyInsights = {
        completedPhases: currentPhase,
        phaseInsights: {},
        keyPatterns: [],
        overallThemes: []
      };

      // Organize insights by what we've learned
      if (extractedInsights) {
        const allInsights = extractedInsights.map(i => i.structured_data);

        // Categorize insights
        allInsights.forEach(insight => {
          if (insight.priorities) journeyInsights.keyPatterns.push(...insight.priorities);
          if (insight.work_items) journeyInsights.keyPatterns.push(...insight.work_items);
          if (insight.personal_items) journeyInsights.keyPatterns.push(...insight.personal_items);
          if (insight.energy_triggers) journeyInsights.keyPatterns.push(...insight.energy_triggers);
          if (insight.core_values) journeyInsights.keyPatterns.push(...insight.core_values);
        });

        // Extract overall themes
        journeyInsights.overallThemes = [...new Set(journeyInsights.keyPatterns)].slice(0, 8);
      }

      // Add phase completion status
      if (conversation?.phase_completion_status) {
        journeyInsights.phaseCompletions = conversation.phase_completion_status;
      }

      return journeyInsights;
    } catch (error) {
      logger.error('❌ Error compiling journey insights:', error);
      return {
        completedPhases: currentPhase,
        error: 'Failed to compile insights'
      };
    }
  }

  /**
   * Handle user response to proactive suggestions (after onboarding complete)
   * @param {string} conversationId - Conversation ID
   * @param {string} userMessage - User's response to suggestions
   * @param {object} user - User info
   * @param {object} proactiveSuggestions - Original suggestions
   * @returns {Promise<object>} - Response to user
   */
  async handleProactiveSuggestionResponse(conversationId, userMessage, user, proactiveSuggestions) {
    try {
      const userName = user.name ? user.name.split(' ')[0] : 'friend';

      logger.info('🔄 Handling proactive suggestion response:', { userName });

      // Generate follow-up response based on user's choice
      const followUp = await this.proactiveSuggestionEngine.generateFollowUpResponse(
        userMessage,
        proactiveSuggestions.rawSuggestions,
        proactiveSuggestions.userInsights,
        userName
      );

      // Store the interaction
      await this.storeMessage(conversationId, 'user', userMessage);
      await this.storeMessage(conversationId, 'assistant', followUp.message);

      return {
        text: followUp.message,
        action: followUp.action,
        suggestion: followUp.suggestion,
        currentPhase: 10,
        phaseCompleted: true,
        nextPhase: 10
      };

    } catch (error) {
      logger.error('❌ Error handling proactive suggestion response:', error);
      return {
        text: "I'm having a moment! Can you try again? What would you like to schedule? 💙",
        currentPhase: 10,
        phaseCompleted: true,
        nextPhase: 10
      };
    }
  }

  async handlePhaseCompletion(conversationId, currentPhase, completionData) {
    // Store comprehensive phase completion data when a phase is finished
    try {
      // Get current phase completion status
      const { data: currentStatus } = await this.supabase
        .from('conversations')
        .select('phase_completion_status')
        .eq('id', conversationId)
        .single();

      const updatedStatus = currentStatus?.phase_completion_status || {};

      // Store comprehensive phase completion data
      const phaseData = {
        [`phase_${currentPhase}_completed`]: true,
        [`phase_${currentPhase}_insights`]: completionData.currentPhaseInsights,
        [`phase_${currentPhase}_completed_at`]: new Date().toISOString(),
        [`phase_${currentPhase}_assessment`]: completionData.assessmentData,
        [`phase_${currentPhase}_completion_message`]: completionData.completionMessage,
        [`phase_${currentPhase}_journey_context`]: completionData.journeyInsights
      };

      // Merge with existing status
      Object.assign(updatedStatus, phaseData);

      await this.supabase
        .from('conversations')
        .update({
          phase_completion_status: updatedStatus
        })
        .eq('id', conversationId);

      // Store in conversation_extracts for easy querying
      await this.supabase
        .from('conversation_extracts')
        .insert([{
          conversation_id: conversationId,
          user_id: (await this.supabase.from('conversations').select('user_id').eq('id', conversationId).single()).data.user_id,
          extract_type: 'phase_completion',
          raw_content: JSON.stringify(completionData),
          structured_data: phaseData,
          confidence_score: completionData.assessmentData?.confidence || 0.8
        }]);

      logger.info(`✅ Phase ${currentPhase} completion data comprehensively stored`);
    } catch (error) {
      logger.error(`❌ Error storing phase ${currentPhase} completion:`, error);
    }
  }

  /**
   * Fetch upcoming events from Google Calendar for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of calendar events
   */
  async fetchGoogleCalendarEvents(userId) {
    try {
      logger.info(`📅 Fetching Google Calendar events for user ${userId}`);

      // Get user's Google Calendar tokens from external_calendar_sync table
      const { data: calendarSync, error: syncError } = await this.supabase
        .from('external_calendar_sync')
        .select('encrypted_access_token, encrypted_refresh_token')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .single();

      if (syncError || !calendarSync) {
        logger.warn(`⚠️ No Google Calendar connection found for user ${userId}`);
        return [];
      }

      // TODO: Implement actual Google Calendar API call
      // For now, return mock data to test the flow
      logger.info(`🔄 Using mock calendar data for testing`);
      
      const mockEvents = [
        {
          id: '1',
          title: 'Team Meeting',
          start: '2024-01-15T10:00:00Z',
          end: '2024-01-15T11:00:00Z',
          description: 'Weekly team sync'
        },
        {
          id: '2', 
          title: 'Doctor Appointment',
          start: '2024-01-16T14:00:00Z',
          end: '2024-01-16T15:00:00Z',
          description: 'Annual checkup'
        },
        {
          id: '3',
          title: 'Grocery Shopping',
          start: '2024-01-17T18:00:00Z', 
          end: '2024-01-17T19:00:00Z',
          description: 'Weekly groceries'
        }
      ];

      return mockEvents;

    } catch (error) {
      logger.error('❌ Error fetching Google Calendar events:', error);
      return [];
    }
  }
}

module.exports = StructuredPrioritizationEngine;
