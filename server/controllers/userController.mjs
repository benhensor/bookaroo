import User from '../models/User.mjs'
import Book from '../models/Book.mjs'
import { Op } from 'sequelize'
import axios from 'axios'

export const getUserDetails = async (req, res) => {
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

export const searchUsers = async (req, res) => {
	const { userId } = req.query
	try {
		const users = await User.findAll({
			where: {
				id: userId,
			},
			attributes: [
				'id',
				'username',
				'email',
				'phone',
				'addressLine1',
				'addressLine2',
				'city',
				'postcode',
				'latitude',
				'longitude',
			],
		})
		res.json(users)
	} catch (error) {
		console.error('Error searching for users:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const updateUserDetails = async (req, res) => {
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

export const likeBook = async (req, res) => {
	try {
		const { bookId } = req.body
		const userId = req.user.id

		const user = await User.findByPk(userId)

		if (!user.likedBooks) {
			user.likedBooks = []
		}

		if (user.likedBooks.includes(bookId)) {
			return res.status(400).json({ message: 'Book is already liked' })
		}

		user.likedBooks = [...user.likedBooks, bookId]
		await user.save()

		res.status(200).json({
			message: 'Book liked successfully',
			likedBooks: user.likedBooks,
		})
	} catch (error) {
		console.error('Error liking book:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const unlikeBook = async (req, res) => {
	try {
		const { bookId } = req.body
		const userId = req.user.id

		const user = await User.findByPk(userId)

		if (!user.likedBooks) {
			return res.status(400).json({ message: 'No liked books found' })
		}

		if (!user.likedBooks.includes(bookId)) {
			return res.status(400).json({ message: 'Book is not liked' })
		}

		user.likedBooks = user.likedBooks.filter((id) => id !== bookId)
		await user.save()

		res.status(200).json({
			message: 'Book unliked successfully',
			likedBooks: user.likedBooks,
		})
	} catch (error) {
		console.error('Error unliking book:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const getLikedBooks = async (req, res) => {
	try {
		const userId = req.user.id

		const user = await User.findByPk(userId)

		if (!user || !user.likedBooks || user.likedBooks.length === 0) {
			return res
				.status(404)
				.json({ message: 'User or liked books not found' })
		}

		const books = await Book.findAll({
			where: {
				id: {
					[Op.in]: user.likedBooks,
				},
			},
			include: {
				model: User,
				as: 'user', // This should match the association alias in your models
				attributes: [
					'id',
					'username',
					'email',
					'phone',
					'addressLine1',
					'addressLine2',
					'city',
					'postcode',
					'latitude',
					'longitude',
				],
			},
		})

		res.status(200).json(books)
	} catch (error) {
		console.error('Error fetching liked books:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const updatePreferences = async (req, res) => {
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