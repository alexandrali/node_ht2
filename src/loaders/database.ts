import {Sequelize} from 'sequelize';
import {UserModel} from '../models/user.model';
import config from '../config';

export const sequelize = new Sequelize(config.dbUrl);

export const Users = sequelize.define('users', UserModel, {paranoid: true});

export default async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
