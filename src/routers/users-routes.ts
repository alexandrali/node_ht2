import {Router} from 'express';
import * as userValidation from '../validation/user-validation-schemas';
import {createValidator} from 'express-joi-validation';
import UsersController from '../controllers/users.controller';

const router = Router();
const validator = createValidator();

router.get(
  '/',
  validator.query(userValidation.suggestUsersQuerySchema),
  UsersController.getSuggestedUsers
);

router.get('/:id', UsersController.getUser);

router.post(
  '/',
  validator.body(userValidation.createUserBodySchema),
  UsersController.createUser
);

router.put(
  '/:id',
  validator.body(userValidation.createUserBodySchema),
  UsersController.editUser
);

router.delete('/:id', UsersController.deleteUser);

export default router;
