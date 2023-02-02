import express from 'express';
import config from './config';
import loaders from './loaders';

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
