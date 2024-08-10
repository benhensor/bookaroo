import sequelize from '../config/database.mjs'
import User from './User.mjs'
import Book from './Book.mjs'
import Message from './Message.mjs'

// User.belongsToMany(Book, { as: 'books', foreignKey: 'userId' })
// Book.belongsToMany(User, { as: 'user', foreignKey: 'bookId' })

// User to book relationship
User.hasMany(Book, { as: 'books', foreignKey: 'userId' })
Book.belongsTo(User, { as: 'user', foreignKey: 'userId' })

// User (sender) to message relationship
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' })
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })

// User (recipient) to message relationship
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'recipientId' })
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' })

// Book to message relationship
Book.hasMany(Message, { as: 'messages', foreignKey: 'bookId' })
Message.belongsTo(Book, { as: 'book', foreignKey: 'bookId' })


const db = { User, Book, Message, sequelize }

export default db