import {Users} from '../loaders/database';
import {Op} from 'sequelize';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import {RESPONSE_MESSAGES} from '../config/messages';
import {USERS_RETURN_ATTRIBUTES} from '../config/return-params';

const SALT_ROUNDS = 10;

export default {
  async getSuggestedUsers(loginSubstring: string, limit: number | undefined) {
    return await Users.findAll({
      where: {
        login: {[Op.substring]: loginSubstring},
      },
      order: [['login', 'ASC']],
      limit: limit,
      attributes: USERS_RETURN_ATTRIBUTES,
    });
  },

  async getUser(id: string) {
    const user = await Users.findByPk(id, {
      attributes: USERS_RETURN_ATTRIBUTES,
    });
    if (!user) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  },

  async createUser(age: number, login: string, password: string) {
    const id = v4();
    await Users.create(
      {
        id: id,
        login,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        age,
      },
      {
        returning: USERS_RETURN_ATTRIBUTES,
      }
    );
    return {id, login, age};
  },

  async updateUser(id: string, age: number, login: string, password: string) {
    const [, [updatedUser]] = await Users.update(
      {login, password: bcrypt.hashSync(password, SALT_ROUNDS), age},
      {
        where: {id: id},
        returning: USERS_RETURN_ATTRIBUTES,
      }
    );
    if (!updatedUser) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    return updatedUser;
  },

  async deleteUser(id: string) {
    return await Users.destroy({
      where: {
        id: id,
      },
    });
  },
};
