import express from 'express'
import axios from 'axios'
import bcrypt from 'bcrypt'
import { User } from '../models/User.mjs'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post('/', async (req, res) => {
	const {
		username,
		phone,
		addressLine1,
		addressLine2,
		city,
		postcode,
		password,
	} = req.body

	// console.log('oauth2complete', req.session)

	const { googleId, email, firstName, lastName } = req.session.data  

	try {
		// Call the Geocodify API to get latitude and longitude
		const response = await axios.get(
			`https://api.geocodify.com/v2/geocode?api_key=${process.env.GEOCODIFY_API_KEY}&q=${addressLine1} ${addressLine2} ${city} ${postcode}`
		)

		const location = response.data.response.features[0].geometry.coordinates

		const hashedPassword = password ? await bcrypt.hash(password, 10) : null

		await User.update(
			{
				username,
				phone,
				addressLine1,
				addressLine2,
				city,
				postcode,
				latitude: location[0],
				longitude: location[1],
				password: hashedPassword,
			},
			{
				where: { googleId },
			}
		)
 
		req.session.userProfile = null

		res.status(201).json({ message: 'User registration completed' })
	} catch (error) {
		console.error('Error completing registration:', error)
		res.status(500).json({ message: 'Internal server error' })
	}
})

export default router
