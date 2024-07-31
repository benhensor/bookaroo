import Book from '../models/book.mjs'

const createBook = async (req, res) => {
	const { isbn, coverImg, title, author, publishedDate, publisher, category, condition, notes, userId } = req.body
	
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
		res.status(400).json({ error: error.message })
	}
}

const getBooks = async (req, res) => {
	try {
		const books = await Book.findAll()
		res.json(books)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export { createBook, getBooks }
