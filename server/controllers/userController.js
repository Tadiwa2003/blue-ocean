import { getUserById, updateUser } from '../data/users.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) {
      user.name = name.trim();
    }

    user.updatedAt = new Date().toISOString();
    updateUser(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile.',
    });
  }
};

