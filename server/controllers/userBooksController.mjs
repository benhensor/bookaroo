import User from '../models/User.mjs'
import Book from '../models/Book.mjs'

export const likeBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body

    const user = await User.findByPk(userId)
    const book = await Book.findByPk(bookId)

    if (!user || !book) {
      return res.status(404).json({ message: 'User or book not found' })
    }

    await user.addBook(book)
    res.status(200).json({ message: 'Book liked successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const unlikeBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body

    const user = await User.findByPk(userId)
    const book = await Book.findByPk(bookId)

    if (!user || !book) {
      return res.status(404).json({ message: 'User or book not found' })
    }

    await user.removeBook(book)
    res.status(200).json({ message: 'Book unliked successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getLikedBooks = async (req, res) => {
  try {
    const { userId } = req.query

    const user = await User.findByPk(userId, {
      include: Book
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user.books)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}