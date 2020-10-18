const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logConfiguration = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  'transports': [
    new winston.transports.File({
      filename: path.join(appRoot, 'log', new Date().toISOString().slice(0, 10) + '-error.log'), level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(appRoot, 'log', new Date().toISOString().slice(0, 10) + '-combined.log')
    })
  ]
};

const logger = winston.createLogger(logConfiguration);

function getLogs() {
  return fs.readdirSync(path.join(appRoot, 'log'));
}

module.exports = { logger, getLogs };