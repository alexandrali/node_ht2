import express, {Response, Request, NextFunction} from 'express';
import {RESPONSE_MESSAGES} from '../config/messages';
import usersRouter from '../routers/users-routes';
import groupsRouter from '../routers/groups-routes';

export default ({app}: {app: express.Application}) => {
  app.use(express.json());
  app.use('/users', usersRouter);
  app.use('/groups', groupsRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.route) {
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
    if (err.message === RESPONSE_MESSAGES.USER_NOT_FOUND) {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    if (err.message === RESPONSE_MESSAGES.GROUP_NOT_FOUND) {
      res.status(404).send(RESPONSE_MESSAGES.GROUP_NOT_FOUND);
    }

    res.status(500).send(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
  });
};
