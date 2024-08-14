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

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://bookaroo-client.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'Authorization']
}

// CORS middleware
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  console.log('CORS request from:', req.headers.origin)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messagesRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found')
})

// Start server
const PORT = process.env.PORT || 5000
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
  // Start the server anyway, so it can serve routes that don't require the database
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (without database)`);
  });
});

export default app