import AuthService from '../services/auth.service';
import {Request, Response} from 'express';
import {NextFunction} from 'connect';

export default {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {login, password} = req.body;
      const token = await AuthService.login(login, password);
      res.send(token);
    } catch (error) {
      next(error);
    }
  },
};
