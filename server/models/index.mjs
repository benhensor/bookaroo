import sequelize from '../config/database.mjs'
import User from './User.mjs'
import Book from './book.mjs'

User.hasMany(Book, { foreignKey: 'userId' })
Book.belongsTo(User, { foreignKey: 'userId' })

const db = { User, Book, sequelize }

export default db
