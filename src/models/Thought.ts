// models/Thought.ts
import { DataTypes, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../db/connection';
import { User } from './User';

export class ThoughtModel extends Model<
  InferAttributes<ThoughtModel>,
  InferCreationAttributes<ThoughtModel, { omit: 'id' }>
> {
  declare id: string;
  declare title: string;

  declare UserId?: string;
}

export const Thought = sequelize.define<ThoughtModel>('Thought', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Thought.belongsTo(User);
User.hasMany(Thought);
