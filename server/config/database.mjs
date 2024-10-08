import { Sequelize } from 'sequelize'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

console.log('Initializing Sequelize with the following configuration:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialectModule: pg,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;


// Original code

// const sequelize = new Sequelize(
// 	process.env.DB_NAME,
// 	process.env.DB_USERNAME,
// 	process.env.DB_PASSWORD,
// 	{
// 		host: process.env.DB_HOST,
// 		dialect: 'postgres',
// 	}
// )

// export default sequelize