import { saveContactMessage, getAllContactMessages } from '../data/contact.js';

// Create contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    const contactMessage = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      company: company || '',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    saveContactMessage(contactMessage);

    res.status(201).json({
      success: true,
      message: 'Contact message received successfully',
      data: {
        contactMessage,
      },
    });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message. Please try again.',
    });
  }
};

// Get all contact messages (admin only)
export const getContactMessages = async (req, res) => {
  try {
    const messages = getAllContactMessages();

    res.json({
      success: true,
      data: {
        messages,
      },
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact messages.',
    });
  }
};

