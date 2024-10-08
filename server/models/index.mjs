import sequelize from '../config/database.mjs'
import User from './User.mjs'
import Book from './Book.mjs'
import Message from './Message.mjs'


// User associations
User.hasMany(Book, { as: 'books', foreignKey: 'userId' })
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' })
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'recipientId' })

// Book associations
Book.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Book.hasMany(Message, { as: 'messages', foreignKey: 'bookId' })

// Message to message relationship
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' })
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })
Message.belongsTo(Book, { as: 'book', foreignKey: 'bookId' })
Message.belongsTo(Message, { as: 'parentMessage', foreignKey: 'parentMessageId' })


const db = { User, Book, Message, sequelize }

export default db