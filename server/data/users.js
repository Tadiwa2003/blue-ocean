import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const USERS_FILE = join(__dirname, 'data', 'users.json');

// Initialize default users with hashed passwords
const initializeDefaultUsers = async () => {
  const saltRounds = 10;
  const defaultUsers = [
    {
      id: 'user_owner_001',
      name: 'Kim Moyo',
      email: 'founder@blueocean.co',
      password: await bcrypt.hash('blueocean2024', saltRounds),
      role: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user_admin_001',
      name: 'Admin User',
      email: 'admin@blueocean.co',
      password: await bcrypt.hash('admin123', saltRounds),
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user_user_001',
      name: 'Test User',
      email: 'user@blueocean.co',
      password: await bcrypt.hash('user123', saltRounds),
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return defaultUsers;
};

// Get users from file
export const getUsers = () => {
  try {
    if (!existsSync(USERS_FILE)) {
      // Initialize with default users if file doesn't exist
      const defaultUsers = [];
      initializeDefaultUsers().then(users => {
        saveUsers(users);
      });
      return defaultUsers;
    }
    const data = readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Save users to file
export const saveUsers = (users) => {
  try {
    // Ensure directory exists
    const dataDir = dirname(USERS_FILE);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Get user by ID
export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Update user
export const updateUser = (updatedUser) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
    return updatedUser;
  }
  return null;
};

// Initialize users file on first run
try {
  const users = getUsers();
  if (!users || users.length === 0) {
    initializeDefaultUsers().then(defaultUsers => {
      saveUsers(defaultUsers);
      console.log('✅ Default users initialized');
    });
  }
} catch (error) {
  // File doesn't exist, will be created on first save
  initializeDefaultUsers().then(defaultUsers => {
    saveUsers(defaultUsers);
    console.log('✅ Default users initialized');
  });
}

