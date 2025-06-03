const winston = require('winston');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Add colors to winston
winston.addColors(logColors);

// Create custom format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message, null, 2);
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

// Create transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: logFormat
  })
];

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  );
}

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels: logLevels,
  transports
});

// Export logger with convenience methods
module.exports = {
  error: (message, meta = {}) => logger.error(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  info: (message, meta = {}) => logger.info(message, meta),
  http: (message, meta = {}) => logger.http(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  
  // Special method for ADHD-friendly logging
  adhdLog: (emoji, message, meta = {}) => {
    logger.info(`${emoji} ${message}`, meta);
  },
  
  // Log choice interactions
  choiceLog: (userId, action, details = {}) => {
    logger.info(`🎯 Choice ${action}`, {
      userId,
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  },
  
  // Log AI interactions
  aiLog: (operation, details = {}) => {
    logger.info(`🤖 AI ${operation}`, {
      operation,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
}; 