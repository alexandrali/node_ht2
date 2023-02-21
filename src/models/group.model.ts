import {DataTypes} from 'sequelize';
import {Permissions} from '../config/enums';

export const GroupModel = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.ENUM(...Object.values(Permissions))),
  },
};
