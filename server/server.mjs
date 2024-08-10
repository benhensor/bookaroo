import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sequelize from './config/database.mjs'
import authRoutes from './routes/authRoutes.mjs'
import bookRoutes from './routes/bookRoutes.mjs'
import userRoutes from './routes/userRoutes.mjs'
import messagesRoutes from './routes/messagesRoutes.mjs'
import './models/index.mjs'

dotenv.config()

const app = express()

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messagesRoutes)

sequelize.sync({ alter: true }).then(() => {
	app.listen(process.env.PORT, () => {
		console.log(`Server running on port ${process.env.PORT}`)
	})
})