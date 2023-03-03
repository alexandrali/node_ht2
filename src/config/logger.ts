import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console({})],
});

export default {
  requestSent(message: string) {
    logger.info(message);
  },
  requestError(message: string) {
    logger.error({
      message,
    });
  },
};
