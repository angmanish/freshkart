const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /api/messages - Send a new message
router.post('/', async (req, res) => {
  const { senderName, senderEmail, subject, message } = req.body;

  try {
    const newMessage = new Message({
      senderName,
      senderEmail,
      subject,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// GET /api/messages - Get all messages (Admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});

// PUT /api/messages/:id/read - Mark a message as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    message.isRead = true;
    await message.save();
    res.status(200).json({ message: 'Message marked as read.', data: message });
  } catch (err) {
    console.error('Error marking message as read:', err);
    res.status(500).json({ message: 'Failed to mark message as read.' });
  }
});

// DELETE /api/messages/:id - Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Failed to delete message.' });
  }
});

module.exports = router;
