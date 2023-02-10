import express, {Response, Request, NextFunction} from 'express';
import {RESPONSE_MESSAGES} from '../config/messages';
import usersRouter from '../routers/users-routes';

export default ({app}: {app: express.Application}) => {
  app.use(express.json());
  app.use('/users', usersRouter);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
      return next();
    }
    console.log('--------');
    console.log(RESPONSE_MESSAGES.USER_NOT_FOUND);
    console.log('---------');
    if (err.message === RESPONSE_MESSAGES.USER_NOT_FOUND) {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    res.status(500).send(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
  });
};
