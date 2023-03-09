import express from 'express';
import config from './config';
import loaders from './loaders';
import logger from './config/logger';

process.on('uncaughtException', err => {
  logger.error(err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}. Reason: ${reason}`);
});

async function startServer() {
  const app = express();
  const port = config.port;

  loaders({app}).then(() => {
    app.listen(port, () => {
      console.log(`Task 1 started on port ${port}...`);
    });
  });
}

startServer();
