import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONTACT_FILE = join(__dirname, 'contact.json');

// Ensure data directory exists
const dataDir = dirname(CONTACT_FILE);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Get all contact messages from file
const getAllContactMessagesFromFile = () => {
  try {
    if (!existsSync(CONTACT_FILE)) {
      return [];
    }
    const data = readFileSync(CONTACT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contact messages:', error);
    return [];
  }
};

// Save contact messages to file
const saveAllContactMessages = (messages) => {
  try {
    writeFileSync(CONTACT_FILE, JSON.stringify(messages, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving contact messages:', error);
    throw error;
  }
};

// Save a single contact message
export const saveContactMessage = (message) => {
  const messages = getAllContactMessagesFromFile();
  messages.push(message);
  saveAllContactMessages(messages);
  return message;
};

// Get all contact messages
export const getAllContactMessages = () => {
  return getAllContactMessagesFromFile();
};

