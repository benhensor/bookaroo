import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 5432,
		dialect: 'postgres',
	}
)
  
const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		firstName: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'first_name',
		},
		lastName: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'last_name',
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: true,
			unique: true,
		}, 
		password: {
			type: DataTypes.STRING(50),
			allowNull: true, // This can be null for OAuth users
		},
		phone: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		addressLine1: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'address_line1',
		},
		addressLine2: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'address_line2',
		},
		city: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		postcode: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		googleId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			field: 'google_id',
		},
		preferences: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		}
	},
	{
		tableName: 'users',
		timestamps: false, // Disable timestamps
	}
)

export { User, sequelize }
