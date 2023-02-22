import {Router} from 'express';
import * as groupValidation from '../validation/group-validation-schemas';
import {createValidator} from 'express-joi-validation';
import GroupsController from '../controllers/groups.controller';

const router = Router();
const validator = createValidator();

router.get('/', GroupsController.getGroups);

router.get('/:id', GroupsController.getGroup);

router.post(
  '/',
  validator.body(groupValidation.groupBodySchema),
  GroupsController.createGroup
);

router.put(
  '/:id',
  validator.body(groupValidation.groupBodySchema),
  GroupsController.editGroup
);

router.delete('/:id', GroupsController.deleteGroup);

router.post(
  '/:id/add-users',
  validator.body(groupValidation.groupUsersBodySchema),
  GroupsController.addUsersToGroup
);

export default router;
