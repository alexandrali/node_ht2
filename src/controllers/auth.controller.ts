import AuthService from '../services/auth.service';
import {Request, Response} from 'express';
import {NextFunction} from 'connect';
import jwt from 'jsonwebtoken';
import config from '../config';

export default {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {login, password} = req.body;
      const user = await AuthService.login(login, password);
      const payload = {id: user.get('id')};
      const token = jwt.sign(payload, config.secret, {expiresIn: 120});
      res.send(token);
    } catch (error) {
      next(error);
    }
  },
};
