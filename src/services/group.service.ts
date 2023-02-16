import {Groups, sequelize, Users} from '../loaders/database';
import {v4} from 'uuid';
import {RESPONSE_MESSAGES} from '../config/messages';
import {
  GROUPS_RETURN_ATTRIBUTES,
  USERS_RETURN_ATTRIBUTES,
} from '../config/return-params';

const INCLUDE_USERS = {
  model: Users,
  attributes: USERS_RETURN_ATTRIBUTES,
  through: {
    attributes: [],
  },
};

export default {
  async getGroups() {
    return await Groups.findAll({
      include: INCLUDE_USERS,
      attributes: GROUPS_RETURN_ATTRIBUTES,
    });
  },

  async getGroup(id: string) {
    const group = await Groups.findByPk(id, {
      include: INCLUDE_USERS,
      attributes: GROUPS_RETURN_ATTRIBUTES,
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
        returning: GROUPS_RETURN_ATTRIBUTES,
      }
    );
    return {id, name, permissions};
  },

  async updateUser(id: string, name: string, permissions: string[]) {
    const [, [updatedGroup]] = await Groups.update(
      {name, permissions},
      {
        where: {id: id},
        returning: GROUPS_RETURN_ATTRIBUTES,
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

  async addUsersToGroup(groupId: string, userIds: string[]) {
    return await sequelize.transaction(async t => {
      const group = await Groups.findOne({
        where: {id: groupId},
        include: INCLUDE_USERS,
        attributes: GROUPS_RETURN_ATTRIBUTES,
        transaction: t,
      });
      if (!group) {
        throw new Error(RESPONSE_MESSAGES.GROUP_NOT_FOUND);
      }

      const users = await Users.findAll({
        where: {id: userIds},
        transaction: t,
      });
      if (users.length !== userIds.length) {
        throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await group.addUsers(users, {
        transaction: t,
      });

      return group;
    });
  },
};
