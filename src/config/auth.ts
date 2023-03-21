import {Response, Request, NextFunction} from 'express';
import {AUTH_MESSAGES} from './messages';
import jwt from 'jsonwebtoken';
import config from '../config';

export default function checkToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).send(AUTH_MESSAGES.NO_TOKEN);
  } else {
    const tokenArray = token.split(' ');
    jwt.verify(tokenArray[1], config.secret, err => {
      if (err) {
        res.status(401).send(AUTH_MESSAGES.FAILED_TO_AUTH);
      } else {
        next();
      }
    });
  }
}
