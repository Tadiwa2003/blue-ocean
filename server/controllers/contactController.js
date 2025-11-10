import { saveContactMessage, getAllContactMessages } from '../data/contact.js';
import crypto from 'crypto';

// Create contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, company, message } = req.body;

    // Support both formats: single 'name' field or 'firstName'/'lastName' fields
    let fullName = '';
    if (firstName && lastName) {
      fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    } else if (name) {
      fullName = name.trim();
    }

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name (or first name and last name) and email are required',
      });
    }

    const contactMessage = {
      id: `contact_${crypto.randomUUID()}`,
      name: fullName,
      firstName: firstName ? firstName.trim() : undefined,
      lastName: lastName ? lastName.trim() : undefined,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      company: company || '',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await createContactMessage(contactMessage);

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
    const messages = await getAllContactMessages();

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

