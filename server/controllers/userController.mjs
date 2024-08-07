import User from '../models/User.mjs'
import axios from 'axios'

const getUserDetails = async (req, res) => {
	try {
		// Ensure that the user information is correctly set by the middleware
		if (!req.user || !req.user.id) {
			return res.status(400).json({ error: 'User not authenticated' })
		}

		const user = await User.findByPk(req.user.id, {
			attributes: { exclude: ['password'] },
		})

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		res.json(user)
	} catch (error) {
		console.error('Error in getUserDetails:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

const searchUsers = async (req, res) => {
	const { userId } = req.query
	try {
		const users = await User.findAll({
			where: {
				id: userId,
			},
			attributes: { exclude: ['password'] },
		})
		res.json(users)
	} catch (error) {
		console.error('Error searching for users:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

const updateUserDetails = async (req, res) => {
	const {
		username,
		email,
		phone,
		addressLine1,
		addressLine2,
		city,
		postcode,
	} = req.body

	if (!username || !email || !phone || !addressLine1 || !city || !postcode) {
		return res.status(400).json({ error: 'Missing required fields' })
	}

	try {
		const response = await axios.get(
			`https://api.geocodify.com/v2/geocode?api_key=${process.env.GEOCODIFY_API_KEY}&q=${city}`
		)

		if (response.data.response.features.length === 0) {
			return res
				.status(400)
				.json({ error: 'Invalid address, geocoding failed' })
		}

		const location = response.data.response.features[0].geometry.coordinates

		const [updatedRows] = await User.update(
			{
				username,
				email,
				phone,
				addressLine1,
				addressLine2,
				city,
				postcode,
				latitude: location[1],
				longitude: location[0],
			},
			{ where: { id: req.user.id } }
		)

		if (updatedRows === 0) {
			return res.status(404).json({ message: 'User not found' })
		}

		const updatedUser = await User.findByPk(req.user.id, {
			attributes: { exclude: ['password'] },
		})

		res.status(200).json(updatedUser)
	} catch (error) {
		console.error('Error updating user details:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

const updatePreferences = async (req, res) => {
	const { preferences } = req.body
	const userId = req.user.id
	console.log('Updating preferences:', userId, preferences)
	try {
		const [updatedRows] = await User.update(
			{ preferences },
			{ where: { id: userId } }
		)
		if (updatedRows === 0) {
			console.log('No rows updated. User not found:', userId)
			return res.status(404).json({ message: 'User not found' })
		}
		console.log('Preferences updated successfully', preferences)
		res.status(200).json({
			message: 'Preferences updated successfully',
			preferences,
		})
	} catch (error) {
		console.error('Error updating preferences:', error)
		res.status(500).json({ message: 'Internal server error' })
	}
}

export { getUserDetails, updateUserDetails, updatePreferences, searchUsers }
