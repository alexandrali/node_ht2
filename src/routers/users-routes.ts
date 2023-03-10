import {Router} from 'express';
import * as userValidation from '../validation/user-validation-schemas';
import {createValidator} from 'express-joi-validation';
import UsersController from '../controllers/users.controller';
import checkToken from '../config/auth';

const router = Router();
const validator = createValidator();

router.get(
  '/',
  validator.query(userValidation.suggestUsersQuerySchema),
  checkToken,
  UsersController.getSuggestedUsers
);

router.get('/:id', checkToken, UsersController.getUser);

router.post(
  '/',
  validator.body(userValidation.createUserBodySchema),
  UsersController.createUser
);

router.put(
  '/:id',
  checkToken,
  validator.body(userValidation.createUserBodySchema),
  UsersController.editUser
);

router.delete('/:id', checkToken, UsersController.deleteUser);

export default router;
