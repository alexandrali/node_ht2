import express, {Response, Request, NextFunction} from 'express';
import {AUTH_MESSAGES, RESPONSE_MESSAGES} from '../config/messages';
import usersRouter from '../routers/users-routes';
import groupsRouter from '../routers/groups-routes';
import authRouter from '../routers/auth-routes';
import logger from '../config/logger';

function getRequestData(req: Request) {
  const {method, url, query} = req;
  const body = {...req.body};
  if (body.password) {
    body.password = '********';
  }
  return {method, url, body, query};
}

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {method, url, body, query} = getRequestData(req);
  logger.info(`Invoking request ${method} ${url}`, {method, url, body, query});
  next();
};

function trackTimeMiddleware(req: Request, res: Response, next: NextFunction) {
  const {method, url} = req;
  const startTime = Date.now();
  res.on('finish', () => {
    const resultTime = Date.now() - startTime + 'ms';
    logger.info(`Request ${method} ${url} was executed`, {
      method,
      url,
      resultTime,
    });
  });
  next();
}

export default ({app}: {app: express.Application}) => {
  app.use(express.json());
  app.use(loggerMiddleware);
  app.use(trackTimeMiddleware);
  app.use('/authenticate', authRouter);
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.route) {
      const {method, url, body, query} = getRequestData(req);
      logger.error(`Request failed: ${method} ${url}`, {
        method,
        url,
        body,
        query,
        error: RESPONSE_MESSAGES.INVALID_URL,
      });
      res.status(400).send(RESPONSE_MESSAGES.INVALID_URL);
    } else {
      next();
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
      return next();
    }
    const {method, url, body, query} = getRequestData(req);
    logger.error(`Request failed: ${method} ${url}`, {
      method,
      url,
      body,
      query,
      error: RESPONSE_MESSAGES.INVALID_URL,
    });
    switch (err.message) {
      case AUTH_MESSAGES.INVALID_CREDENTIALS:
        res.status(401).send(AUTH_MESSAGES.INVALID_CREDENTIALS);
        break;
      case RESPONSE_MESSAGES.USER_NOT_FOUND:
        res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
        break;
      case RESPONSE_MESSAGES.GROUP_NOT_FOUND:
        res.status(404).send(RESPONSE_MESSAGES.GROUP_NOT_FOUND);
        break;
      default:
        res.status(500).send(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  });
};
