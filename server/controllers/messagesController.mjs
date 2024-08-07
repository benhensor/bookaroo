import Message from '../models/Message.mjs';
import User from '../models/User.mjs';
import Book from '../models/Book.mjs';




export const getAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['username'],
        },
        {
          model: Book,
          as: 'book',
          attributes: ['title'],
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching all messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





export const sendMessage = async (req, res) => {
  try {
    const { bookId, message } = req.body;
    const userId = req.user.id; // Assuming the user is authenticated and req.user is available

    const newMessage = await Message.create({
      userId,
      bookId,
      message,
      isRead: false,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export const deleteMessage = async (req, res) => {
  const { messageId } = req.params; // Assuming the message ID is passed as a URL parameter

  try {
    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.destroy(); // Delete the message

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};