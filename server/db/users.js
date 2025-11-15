import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Initialize default users with hashed passwords
export const initializeDefaultUsers = async () => {
  const saltRounds = 10;

  const ownerPassword = process.env.DEFAULT_OWNER_PASSWORD;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const userPassword = process.env.DEFAULT_USER_PASSWORD;

  if (process.env.NODE_ENV === 'production') {
    if (!ownerPassword || !adminPassword || !userPassword) {
      console.warn('⚠️  WARNING: Default user passwords not set in environment variables.');
      console.warn('⚠️  Set DEFAULT_OWNER_PASSWORD, DEFAULT_ADMIN_PASSWORD, and DEFAULT_USER_PASSWORD in production.');
    }
  }

  const defaultUsers = [
    {
      id: 'user_owner_001',
      name: 'Kim Chokutaura',
      email: 'founder@blueocean.co',
      role: 'owner',
      password: ownerPassword || (process.env.NODE_ENV === 'production' ? crypto.randomBytes(32).toString('hex') : 'blueocean2024'),
    },
    {
      id: 'user_admin_001',
      name: 'Admin User',
      email: 'admin@blueocean.co',
      role: 'admin',
      password: adminPassword || (process.env.NODE_ENV === 'production' ? crypto.randomBytes(32).toString('hex') : 'admin123'),
    },
    {
      id: 'user_user_001',
      name: 'Test User',
      email: 'user@blueocean.co',
      role: 'user',
      password: userPassword || (process.env.NODE_ENV === 'production' ? crypto.randomBytes(32).toString('hex') : 'user123'),
    },
  ];

  for (const userData of defaultUsers) {
    try {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        await User.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`✅ Created default user: ${userData.email}`);
      }
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }
};

export const getAllUsers = async () => {
  return await User.find({}).select('-password').lean();
};

export const getUserByEmail = async (email) => {
  // Return password for authentication purposes
  return await User.findOne({ email: email.toLowerCase() }).lean();
};

export const getUserById = async (id) => {
  return await User.findOne({ id }).select('-password').lean();
};

export const createUser = async (userData) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const updateUser = async (id, updateData) => {
  if (updateData.password) {
    const saltRounds = 10;
    updateData.password = await bcrypt.hash(updateData.password, saltRounds);
  }

  const user = await User.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-password').lean();

  return user;
};
