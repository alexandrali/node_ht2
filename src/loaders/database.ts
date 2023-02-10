import {Sequelize} from 'sequelize';
import {UserModel} from '../models/user.model';
import config from '../config';
import {DATABASE_MESSAGES} from '../config/messages';

export const sequelize = new Sequelize(config.dbUrl);

export const Users = sequelize.define('users', UserModel, {paranoid: true});

Users.sync();

export default async () => {
  try {
    await sequelize.authenticate();
    console.log(DATABASE_MESSAGES.CONNECTED);
  } catch (error) {
    console.error(`${DATABASE_MESSAGES.FAILED}: ${error}`);
  }
};
