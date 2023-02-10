import {ValidatedRequest} from 'express-joi-validation';
import * as userValidation from '../validation/validation-schemas';
import UserService from '../services/user.service';
import {Request, Response} from 'express';
import {NextFunction} from 'connect';

export class UsersController {
  static async getSuggestedUsers(
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const loginSubstring = req.query.loginSubstring || '';
      const limit = req.query.limit ? +req.query.limit : undefined;
      const suggestedUsers = await UserService.getSuggestedUsers(
        loginSubstring,
        limit
      );
      res.send(suggestedUsers);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUser(req.params.id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {age, login, password} = req.body;
      const newUser = await UserService.createUser(age, login, password);
      res.send(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async editUser(
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {age, login, password} = req.body;
      const updatedUser = await UserService.updateUser(
        req.params.id,
        age,
        login,
        password
      );
      res.send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
