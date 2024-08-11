import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.mjs'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req, res) => {
	const {
		username,
		email,
		password,
		phone,
		addressLine1,
		addressLine2,
		city,
		postcode,
	} = req.body
	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		const response = await axios.get(
			`https://api.geocodify.com/v2/geocode?api_key=${process.env.GEOCODIFY_API_KEY}&q=${addressLine1} ${addressLine2} ${city} ${postcode}`
		)

		const location = response.data.response.features[0].geometry.coordinates

		await User.create({
			username,
			email,
			password: hashedPassword,
			phone,
			addressLine1,
			addressLine2,
			city,
			postcode,
			latitude: location[1],
			longitude: location[0],
		})
		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

export const login = async (req, res) => {
	const { email, password } = req.body
	try {
		const user = await User.findOne({ where: { email } })
		if (!user) return res.status(404).json({ error: 'User not found' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch)
			return res.status(400).json({ error: 'Invalid credentials' })

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		})
		res.json({ token })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}