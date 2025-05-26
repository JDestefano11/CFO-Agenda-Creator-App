import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register a new user
export const signup = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      confirmEmail, 
      companyName, 
      companyType, 
      jobTitle, 
      password, 
      confirmPassword,
      username 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !confirmEmail || !companyName || 
        !companyType || !jobTitle || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Validate email confirmation
    if (email !== confirmEmail) {
      return res.status(400).json({ 
        message: 'Email and confirmation email do not match' 
      });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: 'Password and confirmation password do not match' 
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with that email' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      companyName,
      companyType,
      jobTitle,
      password,
      username: username || `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
    });

    // Save user to database (password will be hashed by pre-save hook)
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data (excluding password) and token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyName: user.companyName,
        companyType: user.companyType,
        jobTitle: user.jobTitle,
        username: user.username,
        profileImage: user.profileImage,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyName: user.companyName,
        companyType: user.companyType,
        jobTitle: user.jobTitle,
        username: user.username,
        profileImage: user.profileImage,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        companyName: req.user.companyName,
        companyType: req.user.companyType,
        jobTitle: req.user.jobTitle,
        username: req.user.username,
        profileImage: req.user.profileImage,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      companyName, 
      companyType, 
      jobTitle, 
      profileImage 
    } = req.body;
    
    // Create update object with only provided fields
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (companyName) updateFields.companyName = companyName;
    if (companyType) updateFields.companyType = companyType;
    if (jobTitle) updateFields.jobTitle = jobTitle;
    if (profileImage) updateFields.profileImage = profileImage;
    
    // Find user and update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return updated user data
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        companyName: updatedUser.companyName,
        companyType: updatedUser.companyType,
        jobTitle: updatedUser.jobTitle,
        username: updatedUser.username,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};
