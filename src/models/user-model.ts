import {DataTypes} from 'sequelize';

export const UserModel = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};
