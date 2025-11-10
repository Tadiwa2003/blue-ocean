import { readFile, writeFile, mkdir, rename, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import lockfile from 'proper-lockfile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONTACT_FILE = join(__dirname, 'contact.json');

// Ensure data directory exists
const dataDir = dirname(CONTACT_FILE);
if (!existsSync(dataDir)) {
  await mkdir(dataDir, { recursive: true });
}

// Get all contact messages from file (async)
const getAllContactMessagesFromFile = async () => {
  try {
    const data = await readFile(CONTACT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading contact messages:', error);
    throw error;
  }
};

// Save contact messages to file (async with locking)
const saveAllContactMessages = async (messages) => {
  let release;
  try {
    // Acquire file lock with retries
    release = await lockfile.lock(CONTACT_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Atomic write: write to temp file then rename
    const tempPath = `${CONTACT_FILE}.tmp`;
    await writeFile(tempPath, JSON.stringify(messages, null, 2), 'utf8');
    const fs = await import('fs/promises');
    await fs.rename(tempPath, CONTACT_FILE);
  } catch (error) {
    // Clean up temp file on error
    try {
      const fs = await import('fs/promises');
      await fs.unlink(`${CONTACT_FILE}.tmp`).catch(() => {});
    } catch {}
    console.error('Error saving contact messages:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Save a single contact message (async with locking)
export const saveContactMessage = async (message) => {
  let release;
  try {
    // Acquire exclusive file lock
    release = await lockfile.lock(CONTACT_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Re-load latest messages from disk while holding lock
    const messages = await getAllContactMessagesFromFile();
    messages.push(message);
    await saveAllContactMessages(messages);
    return message;
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Get all contact messages (async)
export const getAllContactMessages = async () => {
  return await getAllContactMessagesFromFile();
};

