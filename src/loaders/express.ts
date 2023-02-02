import express, {Response, NextFunction} from 'express';
import {RESPONSE_MESSAGES} from '../config/messages';
import usersRouter from '../routers/users-routes';

export default ({app}: {app: express.Application}) => {
  app.use(express.json());

  app.use((err: unknown, res: Response, next: NextFunction) => {
    if (!err) {
      return next();
    }
    res.status(500).send(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
  });

  app.use('/users', usersRouter);
};
