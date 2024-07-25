import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import pgSession from 'connect-pg-simple'
import configurePassport from './auth.mjs'
import { sequelize } from './models/User.mjs'
import oauth2Complete from './routes/oauth2complete.mjs'
import dotenv from 'dotenv'
import { User } from './models/User.mjs'
 
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
)

app.use(bodyParser.json())

const pgSessionStore = pgSession(session)

const sessionStore = new pgSessionStore({
	conObject: {
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
	},
	tableName: 'session',
	errorLog: (err) => console.error('Session store error:', err),
})

app.use(
	session({
		store: sessionStore,
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, // Note: secure should be true in production with HTTPS
	})
)

app.use(passport.initialize())
app.use(passport.session())

// Middleware to log session data for debugging
app.use((req, res, next) => {
	console.log('Session data:', req.session)
	console.log('User data:', req.user)
	next()
})

configurePassport()

// Define routes for Google OAuth2 authentication
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		prompt: 'select_account',
	})
)

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: 'http://localhost:3000/login',
	}),
	async (req, res) => {
		if (req.user) {
			req.session.data = req.user // Store user profile in session

			// Check if the user has completed their profile
			const user = await User.findByPk(req.user.id)
			if (
				user &&
				user.username &&
				user.phone &&
				user.addressLine1 &&
				user.city &&
				user.postcode
			) {
				// Profile is complete, redirect to the dashboard
				res.redirect('http://localhost:3000/')
			} else {
				// Profile is incomplete, redirect to complete profile page
				res.redirect('http://localhost:3000/complete-profile')
			}
		} else {
			res.redirect('http://localhost:3000/')
		}
	}
)
 
// Add the route to get the current authenticated user
app.get('/api/current_user', (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user)
	} else {
		res.status(401).json({ message: 'Unauthorized' })
	}
})

app.use('/oauth2complete', oauth2Complete)

app.post('/api/update_preferences', async (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	const { preferences } = req.body
	const userId = req.user.id

	try {
		await User.update(
			{ preferences: preferences },
			{ where: { id: userId } }
		)
		res.status(200).json({ message: 'Preferences updated successfully' })
	} catch (error) {
		console.error('Error updating preferences:', error)
		res.status(500).json({ message: 'Internal server error' })
	}
})

app.use((err, req, res, next) => {
	console.error('Server Error:', err.stack)
	res.status(500).json({ message: 'Something broke!', error: err.message })
})

app.listen(PORT, async () => {
	try {
		await sequelize.authenticate()
		console.log(
			'Connection to the database has been established successfully.'
		)
		await sequelize.sync()
		console.log(`Server is running on port ${PORT}`)
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
})
