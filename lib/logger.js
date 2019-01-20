const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: 'info',
  exitOnError: true,
  format: format.combine(
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
