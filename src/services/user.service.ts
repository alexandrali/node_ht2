import {Users} from '../loaders/database';
import {Op} from 'sequelize';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import {RESPONSE_MESSAGES} from '../config/messages';

const SALT_ROUNDS = 10;
const RETURN_ATTRIBUTES = ['id', 'login', 'age'];

export default class UserService {
  static async getSuggestedUsers(
    loginSubstring: string,
    limit: number | undefined
  ) {
    return await Users.findAll({
      where: {
        login: {[Op.substring]: loginSubstring},
      },
      order: [['login', 'ASC']],
      limit: limit,
      attributes: RETURN_ATTRIBUTES,
    });
  }

  static async getUser(id: string) {
    const user = await Users.findByPk(id, {
      attributes: RETURN_ATTRIBUTES,
    });
    if (!user) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  static async createUser(age: number, login: string, password: string) {
    return await Users.create(
      {
        id: v4(),
        login,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        age,
      },
      {
        returning: RETURN_ATTRIBUTES,
      }
    );
  }

  static async updateUser(
    id: string,
    age: number,
    login: string,
    password: string
  ) {
    const [, [updatedUser]] = await Users.update(
      {login, password: bcrypt.hashSync(password, SALT_ROUNDS), age},
      {
        where: {id: id},
        returning: RETURN_ATTRIBUTES,
      }
    );
    if (!updatedUser) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    return updatedUser;
  }

  static async deleteUser(id: string) {
    return await Users.destroy({
      where: {
        id: id,
      },
    });
  }
}
