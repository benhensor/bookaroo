import User from './User.mjs'
import Book from './Book.mjs'
import UserBooks from './UserBooks.mjs'

User.belongsToMany(Book, { through: UserBooks, foreignKey: 'user_id' })
Book.belongsToMany(User, { through: UserBooks, foreignKey: 'book_id', as: 'user' })

export default { User, Book, UserBooks }
