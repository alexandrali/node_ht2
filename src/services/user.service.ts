import {Users} from '../loaders/database';
import {Op} from 'sequelize';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';

const SALT_ROUNDS = 10;
const returnAttributes = ['id', 'login', 'age'];

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
    });
  }

  static async getUser(id: string) {
    return await Users.findByPk(id, {
      attributes: returnAttributes,
    });
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
        returning: returnAttributes,
      }
    );
  }

  static async updateUser(
    id: string,
    age: number,
    login: string,
    password: string
  ) {
    return await Users.update(
      {login, password: bcrypt.hashSync(password, SALT_ROUNDS), age},
      {
        where: {id: id},
        returning: returnAttributes,
      }
    );
  }

  static async deleteUser(id: string) {
    return await Users.destroy({
      where: {
        id: id,
      },
    });
  }
}
