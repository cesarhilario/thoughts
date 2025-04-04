import { sequelize } from '@/db/connection';
import { DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';
import type { ThoughtModel } from './Thought';

class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel, { omit: 'id' }>> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare Thoughts?: ThoughtModel[];
}

export const User = sequelize.define<UserModel>('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // ou DataTypes.UUIDV1 se preferir
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
