import { DataTypes } from 'sequelize'
import sequelize from '../config/database.mjs'
import User from './User.mjs'

const Book = sequelize.define('Book', {
	isbn: {
		type: DataTypes.STRING(13),
		primaryKey: true,
		allowNull: false,
	},
	coverImg: {
		type: DataTypes.STRING(255),
		allowNull: true,
		field: 'cover_img',
	},
	title: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	author: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	publishedDate: {
		type: DataTypes.DATEONLY,
		allowNull: true,
		field: 'published_date',
	},
	publisher: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	genre: {
		type: DataTypes.STRING(50),
		allowNull: true,
	},
	condition: {
		type: DataTypes.STRING(50),
		allowNull: true,
	},
	notes: {
		type: DataTypes.STRING(255),
		allowNull: true,
	},
	userId: {
		type: DataTypes.BIGINT,
		allowNull: false,
		field: 'user_id',
		references: {
			model: User,
			key: 'id',
		},
	},
})

export default Book
