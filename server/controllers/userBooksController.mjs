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
    const { userId } = req.query;
    // console.log('Fetching liked books for user:', userId);

    const user = await User.findByPk(userId, {
      include: {
        model: Book,
        through: { attributes: [] }, // Exclude join table attributes
      },
    });

    if (!user) {
      // console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log('Fetched user:', user);
    // console.log('Liked books:', user.Books);

    res.status(200).json(user.Books);
  } catch (error) {
    console.error('Error fetching liked books:', error.message);
    res.status(500).json({ error: error.message });
  }
};