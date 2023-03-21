import {Router} from 'express';
import * as groupValidation from '../validation/group-validation-schemas';
import {createValidator} from 'express-joi-validation';
import GroupsController from '../controllers/groups.controller';
import checkToken from '../config/auth';

const router = Router();
const validator = createValidator();

router.get('/', checkToken, GroupsController.getGroups);

router.get('/:id', checkToken, GroupsController.getGroup);

router.post(
  '/',
  validator.body(groupValidation.groupBodySchema),
  checkToken,
  GroupsController.createGroup
);

router.put(
  '/:id',
  validator.body(groupValidation.groupBodySchema),
  checkToken,
  GroupsController.editGroup
);

router.delete('/:id', checkToken, GroupsController.deleteGroup);

router.post(
  '/:id/add-users',
  validator.body(groupValidation.groupUsersBodySchema),
  checkToken,
  GroupsController.addUsersToGroup
);

export default router;
