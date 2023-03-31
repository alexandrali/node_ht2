import app from './app';
import config from './config';
import logger from './config/logger';
import loaders from './loaders';

process.on('uncaughtException', err => {
  logger.error(err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}. Reason: ${reason}`);
});

const port = config.port;

loaders({app}).then(() => {
  app.listen(port, () => {
    console.log(`Task 1 started on port ${port}...`);
  });
});
