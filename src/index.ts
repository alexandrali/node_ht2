import express from 'express';
import config from './config';
import loaders from './loaders';

process.on('uncaughtException', err => {
  throw new Error(err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  throw new Error(`Unhandled Rejection at: ${promise}. Reason: ${reason}`);
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
