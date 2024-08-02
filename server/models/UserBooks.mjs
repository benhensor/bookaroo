import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

const UserBooks = sequelize.define('userbooks', {
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  book_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
}, {
  timestamps: false, 
});

export default UserBooks;
