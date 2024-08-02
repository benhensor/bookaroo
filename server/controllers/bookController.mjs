import sequelize from '../config/database.mjs'
import Book from '../models/book.mjs'
import { Op } from 'sequelize'

const listBook = async (req, res) => {
	const {
		isbn,
		coverImg,
		title,
		author,
		publishedDate,
		publisher,
		category,
		condition,
		notes,
		userId,
	} = req.body
	console.log('Book data:', req.body)
	try {
		const newBook = await Book.create({
			isbn,
			coverImg,
			title,
			author,
			publishedDate,
			publisher,
			category,
			condition,
			notes,
			userId,
		})
		res.status(201).json(newBook)
	} catch (error) {
		console.error('Full Sequelize Error:', error.errors)
		res.status(400).json({ error: error.message })
	}
}

const getListedBooks = async (req, res) => {
	try {
		const books = await Book.findAll({
			where: { userId: req.user.id },
		})
		res.json(books)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

const getRecommendations = async (req, res) => {
	const { userId, preferences } = req.query

	if (!preferences || !Array.isArray(preferences)) {
		return res.status(400).json({ error: 'Invalid preferences format' })
	}

	try {
		const books = await Book.findAll({
			where: {
				userId: { [Op.ne]: userId }, // Exclude books listed by the current user
				category: {
					[Op.overlap]: sequelize.literal(
						`ARRAY[${preferences
							.map((pref) => `'${pref}'`)
							.join(',')}]::VARCHAR[]`
					),
				},
			},
		})
		res.json(books)
	} catch (error) {
		console.error('Error fetching recommendations:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

const getAllBooks = async (req, res) => {
	try {
		const books = await Book.findAll()
		res.status(200).json(books)
	} catch (error) {
		console.error('Error fetching all books:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

const searchBooks = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },  // Search by title
                    { author: { [Op.iLike]: `%${query}%` } }, // Search by author
                    { category: { [Op.contains]: [query] } }, // Search by category (if category is an array)
                ]
            }
        });

        res.json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { listBook, getListedBooks, getRecommendations, getAllBooks, searchBooks }
