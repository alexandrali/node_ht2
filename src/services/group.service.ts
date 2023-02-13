import {Groups} from '../loaders/database';
import {v4} from 'uuid';
import {RESPONSE_MESSAGES} from '../config/messages';

const RETURN_ATTRIBUTES = ['id', 'name', 'permissions'];

export default {
  async getGroups() {
    return await Groups.findAll({
      attributes: RETURN_ATTRIBUTES,
    });
  },

  async getGroup(id: string) {
    const group = await Groups.findByPk(id, {
      attributes: RETURN_ATTRIBUTES,
    });
    if (!group) {
      throw new Error(RESPONSE_MESSAGES.GROUP_NOT_FOUND);
    }
    return group;
  },

  async createUser(name: string, permissions: string[]) {
    const id = v4();
    await Groups.create(
      {
        id: id,
        name,
        permissions,
      },
      {
        returning: RETURN_ATTRIBUTES,
      }
    );
    return {id, name, permissions};
  },

  async updateUser(id: string, name: string, permissions: string[]) {
    const [, [updatedGroup]] = await Groups.update(
      {name, permissions},
      {
        where: {id: id},
        returning: RETURN_ATTRIBUTES,
      }
    );
    if (!updatedGroup) {
      throw new Error(RESPONSE_MESSAGES.GROUP_NOT_FOUND);
    }
    return updatedGroup;
  },

  async deleteGroup(id: string) {
    return await Groups.destroy({
      where: {
        id: id,
      },
    });
  },
};
