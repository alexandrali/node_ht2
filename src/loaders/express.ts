import express, {Response, Request, NextFunction} from 'express';
import {RESPONSE_MESSAGES} from '../config/messages';
import usersRouter from '../routers/users-routes';
import groupsRouter from '../routers/groups-routes';
import logger from '../config/logger';

function getRequestData(req: Request) {
  const {method, url} = req;
  const body = {...req.body};
  if (body.password) {
    body.password = '********';
  }
  return {method, url, body};
}

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {method, url, body} = getRequestData(req);
  logger.requestSent(
    `Invoking request ${method} ${url} with body: ${JSON.stringify(body)}`
  );
  next();
};

function trackTimeMiddleware(req: Request, res: Response, next: NextFunction) {
  const {method, url} = req;
  const startTime = Date.now();
  res.on('finish', () => {
    const resultTime = Date.now() - startTime;
    logger.requestSent(
      `Request ${method} ${url} took ${resultTime}ms to execute`
    );
  });
  next();
}

export default ({app}: {app: express.Application}) => {
  app.use(express.json());
  app.use(loggerMiddleware);
  app.use(trackTimeMiddleware);
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.route) {
      const {method, url, body} = getRequestData(req);
      logger.requestError(
        `Request failed: ${method} ${url} with body: ${JSON.stringify(
          body
        )}, error message: ${RESPONSE_MESSAGES.INVALID_URL}`
      );
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
    const {method, url, body} = getRequestData(req);
    logger.requestError(
      `Request failed: ${method} ${url} with body: ${JSON.stringify(
        body
      )}, error message: ${err.message}`
    );
    switch (err.message) {
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
