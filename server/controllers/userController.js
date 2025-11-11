import { getUserById, updateUser } from '../db/users.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

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
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let updateData = {};
    if (name) {
      const trimmedName = name.trim();
      // Validate name
      if (trimmedName.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty.',
        });
      }
      if (trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Name must be 100 characters or less.',
        });
      }
      // Validate allowed characters (letters, spaces, hyphens, apostrophes)
      if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
        return res.status(400).json({
          success: false,
          message: 'Name can only contain letters, spaces, hyphens, and apostrophes.',
        });
      }
      updateData.name = trimmedName;
    }

    const updatedUser = await updateUser(req.user.id, updateData);

    // Password already excluded in updateUser
    const userWithoutPassword = updatedUser;

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

