const axios = require('axios');
const { google } = require('googleapis');
const { Database } = require('../utils/database');
const logger = require('../utils/logger');

/**
 * Data Collection Service for BrainSync Pro
 * Replaces all n8n data collection workflows
 */
class DataCollector {

  /**
   * Collect all data for a user (main orchestrator method)
   */
  static async collectUserData(userId) {
    logger.info(`🔄 Starting data collection for user ${userId}`);
    
    try {
      // Get user preferences for data collection
      const user = await Database.getUser(userId);
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      const results = {
        userId,
        timestamp: new Date().toISOString(),
        collected: {},
        errors: {}
      };

      // Collect calendar data
      try {
        const calendarData = await this.collectCalendarData(user);
        if (calendarData) {
          await Database.storeDataPoint(userId, 'calendar', calendarData);
          results.collected.calendar = calendarData;
          logger.adhdLog('📅', `Calendar data collected for ${user.email}`);
        }
      } catch (error) {
        results.errors.calendar = error.message;
        logger.warn('Failed to collect calendar data:', { userId, error: error.message });
      }

      // Collect weather data
      try {
        const weatherData = await this.collectWeatherData(user);
        if (weatherData) {
          await Database.storeDataPoint(userId, 'weather', weatherData);
          results.collected.weather = weatherData;
          logger.adhdLog('🌤️', `Weather data collected for ${user.preferences?.location || 'default location'}`);
        }
      } catch (error) {
        results.errors.weather = error.message;
        logger.warn('Failed to collect weather data:', { userId, error: error.message });
      }

      // Collect Habitica data
      try {
        const habiticaData = await this.collectHabiticaData(user);
        if (habiticaData) {
          await Database.storeDataPoint(userId, 'habit', habiticaData);
          results.collected.habitica = habiticaData;
          logger.adhdLog('🎮', `Habitica data collected for ${user.email}`);
        }
      } catch (error) {
        results.errors.habitica = error.message;
        logger.warn('Failed to collect Habitica data:', { userId, error: error.message });
      }

      // Update user last active
      await Database.updateUserLastActive(userId);

      logger.info(`✅ Data collection completed for user ${userId}`, {
        collected: Object.keys(results.collected),
        errors: Object.keys(results.errors)
      });

      return results;

    } catch (error) {
      logger.error('Data collection failed:', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Collect Google Calendar data
   */
  static async collectCalendarData(user) {
    if (!user.google_calendar_token) {
      logger.debug('No Google Calendar token found for user');
      return null;
    }

    try {
      // Set up OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: user.google_calendar_token,
        refresh_token: user.google_refresh_token
      });

      // Initialize Calendar API
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // Get events for today and tomorrow
      const timeMin = new Date();
      timeMin.setHours(0, 0, 0, 0);
      
      const timeMax = new Date(timeMin);
      timeMax.setDate(timeMax.getDate() + 2); // Today + tomorrow

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      // Process events for ADHD-friendly insights
      const processedEvents = events.map(event => ({
        id: event.id,
        title: event.summary || 'Untitled Event',
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || '',
        location: event.location || '',
        isAllDay: !event.start?.dateTime,
        attendees: event.attendees?.length || 0,
        isRecurring: !!event.recurringEventId,
        created: event.created,
        updated: event.updated
      }));

      // Calculate calendar insights for ADHD support
      const insights = {
        totalEvents: processedEvents.length,
        todayEvents: processedEvents.filter(e => {
          const eventDate = new Date(e.start);
          const today = new Date();
          return eventDate.toDateString() === today.toDateString();
        }).length,
        tomorrowEvents: processedEvents.filter(e => {
          const eventDate = new Date(e.start);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return eventDate.toDateString() === tomorrow.toDateString();
        }).length,
        hasBackToBackMeetings: this.detectBackToBackMeetings(processedEvents),
        longestFreeBlock: this.calculateLongestFreeBlock(processedEvents),
        energyDemandingEvents: processedEvents.filter(e => 
          e.attendees > 3 || e.title.toLowerCase().includes('meeting') || e.title.toLowerCase().includes('call')
        ).length
      };

      return {
        events: processedEvents,
        insights,
        collectedAt: new Date().toISOString(),
        source: 'google_calendar'
      };

    } catch (error) {
      if (error.code === 401) {
        logger.warn('Google Calendar token expired, need to refresh');
        // In a real implementation, you'd refresh the token here
      }
      throw new Error(`Google Calendar API error: ${error.message}`);
    }
  }

  /**
   * Collect weather data
   */
  static async collectWeatherData(user) {
    if (!process.env.OPENWEATHER_API_KEY) {
      logger.debug('No OpenWeather API key configured');
      return null;
    }

    try {
      // Get location from user preferences or default to Portland
      const location = user.preferences?.location || 'Portland,OR,US';
      const apiKey = process.env.OPENWEATHER_API_KEY;

      // Current weather
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: location,
            appid: apiKey,
            units: 'imperial'
          },
          timeout: 5000
        }
      );

      // 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: location,
            appid: apiKey,
            units: 'imperial'
          },
          timeout: 5000
        }
      );

      const current = currentResponse.data;
      const forecast = forecastResponse.data;

      // ADHD-relevant weather insights
      const insights = {
        adhdFriendlyConditions: this.assessADHDWeatherImpact(current),
        barometricPressure: current.main.pressure,
        humidityLevel: current.main.humidity,
        visibilityKm: current.visibility / 1000,
        sunriseTime: new Date(current.sys.sunrise * 1000).toLocaleTimeString(),
        sunsetTime: new Date(current.sys.sunset * 1000).toLocaleTimeString(),
        dayLightHours: ((current.sys.sunset - current.sys.sunrise) / 3600).toFixed(1)
      };

      return {
        current: {
          temperature: Math.round(current.main.temp),
          feelsLike: Math.round(current.main.feels_like),
          condition: current.weather[0].main,
          description: current.weather[0].description,
          humidity: current.main.humidity,
          pressure: current.main.pressure,
          windSpeed: current.wind.speed,
          cloudiness: current.clouds.all
        },
        forecast: forecast.list.slice(0, 8).map(item => ({
          time: item.dt_txt,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          description: item.weather[0].description
        })),
        insights,
        location: current.name,
        collectedAt: new Date().toISOString(),
        source: 'openweather'
      };

    } catch (error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
  }

  /**
   * Collect Habitica data
   */
  static async collectHabiticaData(user) {
    if (!user.habitica_user_id || !user.habitica_api_token) {
      logger.debug('No Habitica credentials found for user');
      return null;
    }

    try {
      const headers = {
        'x-api-user': user.habitica_user_id,
        'x-api-key': user.habitica_api_token,
        'Content-Type': 'application/json'
      };

      // Get user data
      const userResponse = await axios.get('https://habitica.com/api/v3/user', { 
        headers,
        timeout: 5000 
      });

      // Get tasks
      const tasksResponse = await axios.get('https://habitica.com/api/v3/tasks/user', { 
        headers,
        timeout: 5000 
      });

      const userData = userResponse.data.data;
      const tasks = tasksResponse.data.data;

      // ADHD-relevant Habitica insights
      const insights = {
        totalXP: userData.stats.exp,
        level: userData.stats.lvl,
        health: userData.stats.hp,
        mana: userData.stats.mp,
        gold: userData.stats.gp,
        streakCount: userData.habits?.filter(h => h.streak > 0).length || 0,
        overdueDeadlines: tasks.filter(t => t.type === 'daily' && !t.completed && new Date(t.date) < new Date()).length,
        completedTodayCount: tasks.filter(t => t.completed && new Date(t.dateCompleted).toDateString() === new Date().toDateString()).length
      };

      return {
        profile: {
          level: userData.stats.lvl,
          experience: userData.stats.exp,
          health: userData.stats.hp,
          mana: userData.stats.mp,
          gold: userData.stats.gp
        },
        tasks: {
          habits: tasks.filter(t => t.type === 'habit').map(t => ({
            id: t.id,
            text: t.text,
            value: t.value,
            streak: t.streak || 0,
            completed: t.completed
          })),
          dailies: tasks.filter(t => t.type === 'daily').map(t => ({
            id: t.id,
            text: t.text,
            completed: t.completed,
            streak: t.streak || 0,
            isDue: !t.completed
          })),
          todos: tasks.filter(t => t.type === 'todo' && !t.completed).slice(0, 10).map(t => ({
            id: t.id,
            text: t.text,
            priority: t.priority,
            dueDate: t.date
          }))
        },
        insights,
        collectedAt: new Date().toISOString(),
        source: 'habitica'
      };

    } catch (error) {
      throw new Error(`Habitica API error: ${error.message}`);
    }
  }

  /**
   * Helper: Detect back-to-back meetings
   */
  static detectBackToBackMeetings(events) {
    if (events.length < 2) return false;
    
    for (let i = 0; i < events.length - 1; i++) {
      const currentEnd = new Date(events[i].end);
      const nextStart = new Date(events[i + 1].start);
      const gap = nextStart - currentEnd;
      
      // If gap is less than 15 minutes, consider it back-to-back
      if (gap < 15 * 60 * 1000) {
        return true;
      }
    }
    return false;
  }

  /**
   * Helper: Calculate longest free block
   */
  static calculateLongestFreeBlock(events) {
    if (events.length === 0) return 480; // 8 hours if no events
    
    const workdayStart = new Date();
    workdayStart.setHours(9, 0, 0, 0);
    const workdayEnd = new Date();
    workdayEnd.setHours(17, 0, 0, 0);
    
    let longestBlock = 0;
    let currentTime = workdayStart;
    
    for (const event of events) {
      const eventStart = new Date(event.start);
      if (eventStart > workdayEnd) break;
      
      const freeTime = Math.max(0, eventStart - currentTime);
      longestBlock = Math.max(longestBlock, freeTime);
      
      currentTime = new Date(event.end);
    }
    
    // Check time from last event to end of workday
    if (currentTime < workdayEnd) {
      const finalFreeTime = workdayEnd - currentTime;
      longestBlock = Math.max(longestBlock, finalFreeTime);
    }
    
    return Math.round(longestBlock / (1000 * 60)); // Return in minutes
  }

  /**
   * Helper: Assess ADHD-relevant weather impact
   */
  static assessADHDWeatherImpact(weatherData) {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const condition = weatherData.weather[0].main.toLowerCase();
    
    let score = 5; // Start with neutral
    
    // Temperature comfort (ADHD brains often sensitive to temperature)
    if (temp >= 65 && temp <= 75) score += 2;
    else if (temp < 50 || temp > 85) score -= 2;
    
    // Humidity (high humidity can affect focus)
    if (humidity < 50) score += 1;
    else if (humidity > 70) score -= 1;
    
    // Barometric pressure (can affect mood/focus)
    if (pressure < 29.8) score -= 1; // Low pressure
    
    // Weather conditions
    if (condition.includes('clear') || condition.includes('sun')) score += 2;
    else if (condition.includes('rain') || condition.includes('storm')) score -= 1;
    
    return {
      score: Math.max(1, Math.min(10, score)),
      factors: {
        temperatureComfort: temp >= 65 && temp <= 75,
        lowHumidity: humidity < 50,
        stablePressure: pressure >= 29.8,
        clearSkies: condition.includes('clear') || condition.includes('sun')
      },
      recommendation: score >= 7 ? 'Great day for focus work!' : 
                      score >= 5 ? 'Decent conditions for productivity' : 
                      'Consider indoor activities or extra self-care'
    };
  }
}

module.exports = { DataCollector }; 