import User from '../models/User.js';
import Document from '../models/Document.js';

// Helper function to handle document queries safely
const safeDocumentQuery = async (query) => {
  try {
    return await query;
  } catch (error) {
    console.error('Document query error:', error);
    return [];
  }
};

// Get user profile with document history
export const getProfile = async (req, res) => {
  try {
  
    const user = req.user;
    
    // Find all documents uploaded by this user 
    const documents = await safeDocumentQuery(
      Document.find({ $or: [{ user: user._id }, { uploadedBy: user._id }] })
        .sort({ createdAt: -1 }) // Sort by newest first
        .select('fileName fileType fileSize createdAt updatedAt')
        .limit(10)
    );
    
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt
      },
      documents
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email, profileImage } = req.body;
    
    // Check if username or email already exists 
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }
    
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Find user and update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        ...(username && { username }),
        ...(email && { email }),
        ...(profileImage && { profileImage })
      },
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
        username: updatedUser.username,
        email: updatedUser.email,
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

// Delete user profile
export const deleteProfile = async (req, res) => {
  try {
    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    await Document.updateMany(
      { user: req.user._id },
      { user: null }
    );
    
    res.status(200).json({ 
      message: 'Profile deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting profile', 
      error: error.message 
    });
  }
};

// Get document history for the user
export const getDocumentHistory = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Find documents with pagination (using either user or uploadedBy field)
    const documents = await safeDocumentQuery(
      Document.find({ $or: [{ user: req.user._id }, { uploadedBy: req.user._id }] })
        .sort({ updatedAt: -1 }) // Sort by last updated
        .skip(skip)
        .limit(limit)
        .select('fileName fileType fileSize createdAt updatedAt')
    );
    
    // Get total count for pagination
    const totalDocuments = await safeDocumentQuery(
      Document.countDocuments({ $or: [{ user: req.user._id }, { uploadedBy: req.user._id }] })
    ) || 0;
    
    res.status(200).json({
      documents,
      pagination: {
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Document history error:', error);
    res.status(500).json({ 
      message: 'Error fetching document history', 
      error: error.message 
    });
  }
};

// Get document details
export const getDocumentDetails = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Find the document and check if it belongs to the user (using either user or uploadedBy field)
    const document = await safeDocumentQuery(
      Document.findOne({ 
        _id: documentId, 
        $or: [{ user: req.user._id }, { uploadedBy: req.user._id }]
      })
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found or access denied' });
    }
    
    res.status(200).json({ document });
  } catch (error) {
    console.error('Document details error:', error);
    res.status(500).json({ 
      message: 'Error fetching document details', 
      error: error.message 
    });
  }
};
