import Contact from '../models/Contact.js';
import crypto from 'crypto';

export const getAllContacts = async () => {
  return await Contact.find({}).sort({ createdAt: -1 }).lean();
};

export const getContactById = async (id) => {
  return await Contact.findOne({ id }).lean();
};

export const createContact = async (contactData) => {
  // Generate ID if not provided
  if (!contactData.id) {
    contactData.id = `contact_${crypto.randomUUID()}`;
  }

  // Handle name field (support both old and new format)
  if (contactData.firstName && contactData.lastName) {
    contactData.name = `${contactData.firstName} ${contactData.lastName}`.trim();
  } else if (contactData.name && !contactData.firstName) {
    // Split name into first and last if only name is provided
    const nameParts = contactData.name.trim().split(' ');
    contactData.firstName = nameParts[0] || '';
    contactData.lastName = nameParts.slice(1).join(' ') || '';
  }

  const contact = await Contact.create(contactData);
  return contact.toObject();
};

export const updateContact = async (id, updateData) => {
  const contact = await Contact.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();
  return contact;
};

export const deleteContact = async (id) => {
  const result = await Contact.findOneAndDelete({ id });
  return result ? result.toObject() : null;
};
