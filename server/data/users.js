import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const USERS_FILE = join(__dirname, 'data', 'users.json');

// Helper to generate strong random password
function generateRandomPassword() {
  return crypto.randomBytes(32).toString('hex');
}

// Initialize default users with hashed passwords from environment variables
const initializeDefaultUsers = async () => {
  const saltRounds = 10;
  
  // Get passwords from environment variables
  const ownerPassword = process.env.DEFAULT_OWNER_PASSWORD;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const userPassword = process.env.DEFAULT_USER_PASSWORD;
  
  // Warn if using defaults in production
  if (process.env.NODE_ENV === 'production') {
    if (!ownerPassword || !adminPassword || !userPassword) {
      console.warn('⚠️  WARNING: Default user passwords not set in environment variables.');
      console.warn('⚠️  Set DEFAULT_OWNER_PASSWORD, DEFAULT_ADMIN_PASSWORD, and DEFAULT_USER_PASSWORD in production.');
    }
  }
  
  // Generate random passwords if not set (non-production only)
  const finalOwnerPassword = ownerPassword || (process.env.NODE_ENV === 'production' ? null : generateRandomPassword());
  const finalAdminPassword = adminPassword || (process.env.NODE_ENV === 'production' ? null : generateRandomPassword());
  const finalUserPassword = userPassword || (process.env.NODE_ENV === 'production' ? null : generateRandomPassword());
  
  if (!finalOwnerPassword || !finalAdminPassword || !finalUserPassword) {
    throw new Error('Default user passwords must be set via environment variables in production');
  }
  
  const defaultUsers = [
    {
      id: 'user_owner_001',
      name: 'Kim Moyo',
      email: 'founder@blueocean.co',
      password: await bcrypt.hash(finalOwnerPassword, saltRounds),
      role: 'owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user_admin_001',
      name: 'Admin User',
      email: 'admin@blueocean.co',
      password: await bcrypt.hash(finalAdminPassword, saltRounds),
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'user_user_001',
      name: 'Test User',
      email: 'user@blueocean.co',
      password: await bcrypt.hash(finalUserPassword, saltRounds),
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return defaultUsers;
};

// Get users from file (async)
let usersInitialized = false;
export const getUsers = async () => {
  try {
    // Initialize if file doesn't exist
    if (!existsSync(USERS_FILE)) {
      if (!usersInitialized) {
        usersInitialized = true;
        const defaultUsers = await initializeDefaultUsers();
        await saveUsers(defaultUsers);
        console.log('✅ Default users initialized');
        return defaultUsers;
      }
      return [];
    }
    
    const data = await readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    
    // Initialize if users array is empty
    if (!users || users.length === 0) {
      if (!usersInitialized) {
        usersInitialized = true;
        const defaultUsers = await initializeDefaultUsers();
        await saveUsers(defaultUsers);
        console.log('✅ Default users initialized');
        return defaultUsers;
      }
    }
    
    return users;
  } catch (error) {
    console.error('Error reading users:', error);
    throw error;
  }
};

// Save users to file (async)
export const saveUsers = async (users) => {
  try {
    // Ensure directory exists
    const dataDir = dirname(USERS_FILE);
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// Get user by email (async)
export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Get user by ID (async)
export const getUserById = async (id) => {
  const users = await getUsers();
  return users.find(user => user.id === id);
};

// Update user (async with validation)
export const updateUser = async (updatedUser) => {
  // Validate updatedUser
  if (!updatedUser || typeof updatedUser !== 'object') {
    throw new Error('Invalid user data');
  }
  
  if (!updatedUser.id || (typeof updatedUser.id !== 'string' && typeof updatedUser.id !== 'number')) {
    throw new Error('User id is required and must be a string or number');
  }
  
  const users = await getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  
  if (index === -1) {
    return null;
  }
  
  // Merge existing user with allowed fields from updatedUser
  const existingUser = users[index];
  const mergedUser = {
    ...existingUser,
    ...updatedUser,
    // Preserve immutable fields
    id: existingUser.id,
    createdAt: existingUser.createdAt,
    password: existingUser.password, // Don't allow password updates through this method
  };
  
  // Set updatedAt timestamp
  mergedUser.updatedAt = new Date().toISOString();
  
  users[index] = mergedUser;
  await saveUsers(users);
  return mergedUser;
};

