import {Response, Request, NextFunction} from 'express';
import {AUTH_MESSAGES} from './messages';
import jwt from 'jsonwebtoken';
import config from '../config';

export default function checkToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authenticate'];
  if (!token) {
    return res.status(401).send(AUTH_MESSAGES.NO_TOKEN);
  } else {
    return jwt.verify(token.toString(), config.secret, err => {
      if (err) {
        return res.status(401).send(AUTH_MESSAGES.FAILED_TO_AUTH);
      } else {
        return next();
      }
    });
  }
}
