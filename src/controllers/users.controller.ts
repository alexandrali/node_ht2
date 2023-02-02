import {ValidatedRequest} from 'express-joi-validation';
import * as userValidation from '../validation/validation-schemas';
import UserService from '../services/user.service';
import {Request, Response} from 'express';
import {RESPONSE_MESSAGES} from '../config/messages';

export class UsersController {
  static async getSuggestedUsers(
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) {
    const loginSubstring = req.query.loginSubstring || '';
    const limit = req.query.limit ? +req.query.limit : undefined;
    const suggestedUsers = await UserService.getSuggestedUsers(
      loginSubstring,
      limit
    );
    res.send(suggestedUsers);
  }

  static async getUser(req: Request, res: Response) {
    const user = await UserService.getUser(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
  }

  static async createUser(
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) {
    const {age, login, password} = req.body;
    const newUser = await UserService.createUser(age, login, password);
    res.send(newUser);
  }

  static async editUser(
    req: ValidatedRequest<userValidation.UserRequestBodySchema>,
    res: Response
  ) {
    const {age, login, password} = req.body;
    const existedUser = await UserService.getUser(req.params.id);
    if (!existedUser) {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    } else {
      const [, [updatedUser]] = await UserService.updateUser(
        req.params.id,
        age,
        login,
        password
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        res.status(500).send(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const existedUser = await UserService.getUser(req.params.id);
    if (!existedUser) {
      res.status(404).send(RESPONSE_MESSAGES.USER_NOT_FOUND);
    } else {
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    }
  }
}
