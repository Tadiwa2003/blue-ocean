import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getAllUsers, createUser, getUserByEmail, getUserById } from '../db/users.js';
import { getConnectionStatus } from '../db/connection.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set. Application cannot start.');
  process.exit(1);
}
const JWT_EXPIRES_IN = '7d';

// Fallback users for development when database is offline
const FALLBACK_USERS = [
  {
    id: 'user_owner_001',
    name: 'Kim Moyo',
    email: 'founder@blueocean.co',
    role: 'owner',
    password: 'blueocean2024',
  },
  {
    id: 'user_admin_001',
    name: 'Admin User',
    email: 'admin@blueocean.co',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'user_user_001',
    name: 'Test User',
    email: 'user@blueocean.co',
    role: 'user',
    password: 'user123',
  },
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Sign up new user
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in instead.',
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await createUser({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Will be hashed in createUser
      role: 'user',
    });

    // Generate token
    const token = generateToken(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again.',
    });
  }
};

// Sign in user
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if database is connected
    if (!getConnectionStatus()) {
      // In development, allow fallback users when database is offline
      if (process.env.NODE_ENV !== 'production') {
        const fallbackUser = FALLBACK_USERS.find(
          (user) => user.email.toLowerCase() === email.toLowerCase().trim(),
        );

        if (fallbackUser && password === fallbackUser.password) {
          const { password: _, ...userWithoutPassword } = fallbackUser;
          const token = generateToken(userWithoutPassword);
          return res.status(200).json({
            success: true,
            message: 'Signed in using fallback credentials (database offline).',
            data: {
              user: userWithoutPassword,
              token,
              isFallbackUser: true,
            },
          });
        }
      }

      return res.status(503).json({
        success: false,
        message: 'Database is not available. Please ensure MongoDB is running. See DATABASE_SETUP.md for instructions.',
      });
    }

    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sign in. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// Sign out user (token invalidation would be handled client-side)
export const signOut = async (req, res) => {
  try {
    // In a production app, you might want to maintain a token blacklist
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sign out. Please try again.',
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Password already excluded in getUserById
    const userWithoutPassword = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information.',
    });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // In production, send email with reset token
    // For now, just return success
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request.',
    });
  }
};

