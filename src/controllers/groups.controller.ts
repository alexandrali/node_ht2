import {ValidatedRequest} from 'express-joi-validation';
import * as groupValidation from '../validation/group-validation-schemas';
import GroupService from '../services/group.service';
import {Request, Response, NextFunction} from 'express';

export default {
  async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await GroupService.getGroups();
      res.send(groups);
    } catch (error) {
      next(error);
    }
  },

  async getGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await GroupService.getGroup(req.params.id);
      res.send(group);
    } catch (error) {
      next(error);
    }
  },

  async createGroup(
    req: ValidatedRequest<groupValidation.GroupRequestBodySchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {name, permissions} = req.body;
      const newGroup = await GroupService.createGroup(name, permissions);
      res.send(newGroup);
    } catch (error) {
      next(error);
    }
  },

  async editGroup(
    req: ValidatedRequest<groupValidation.GroupRequestBodySchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {name, permissions} = req.body;
      const updatedGroup = await GroupService.updateGroup(
        req.params.id,
        name,
        permissions
      );
      res.send(updatedGroup);
    } catch (error) {
      next(error);
    }
  },

  async deleteGroup(req: Request, res: Response, next: NextFunction) {
    try {
      await GroupService.deleteGroup(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async addUsersToGroup(
    req: ValidatedRequest<groupValidation.GroupUsersRequestBodySchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const group = await GroupService.addUsersToGroup(
        req.params.id,
        req.body.userIds
      );
      res.send(group);
    } catch (error) {
      next(error);
    }
  },
};
