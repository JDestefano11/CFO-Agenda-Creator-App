// controllers/documentHistoryController.js
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import DocumentHistory from '../models/DocumentHistory.js';

// Get list of document history entries for the user
export const getUserDocumentHistory = async (req, res) => {
  try {
    // Get all history entries for this user, sorted by most recent first
    const historyEntries = await DocumentHistory.aggregate([
      // Match history entries for this user
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
      // Sort by timestamp descending (newest first)
      { $sort: { timestamp: -1 } },
      // Group by documentId to get only the latest entry for each document
      { $group: {
        _id: "$documentId",
        latestEntry: { $first: "$$ROOT" }
      }},
      // Replace the root with the latest entry
      { $replaceRoot: { newRoot: "$latestEntry" } },
      // Sort again by timestamp to get newest overall first
      { $sort: { timestamp: -1 } },
      // Limit to a reasonable number
      { $limit: 20 }
    ]);
    
    // Format the response
    const formattedHistory = historyEntries.map(entry => ({
      id: entry._id,
      documentId: entry.documentId,
      fileName: entry.fileName,
      fileType: entry.fileType,
      version: entry.version,
      timestamp: entry.timestamp,
      summary: entry.analysisSnapshot?.summary || "No analysis available"
    }));
    
    res.status(200).json({
      message: 'Document history retrieved successfully',
      history: formattedHistory
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving document history', 
      error: error.message 
    });
  }
};

// Get complete history for a specific document
export const getDocumentVersionHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // Verify document exists and user has access
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get all versions of this document
    const versionHistory = await DocumentHistory.find({ documentId })
      .sort({ version: -1 });
    
    res.status(200).json({
      message: 'Document version history retrieved successfully',
      currentDocument: {
        id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        createdAt: document.createdAt,
        analysis: document.analysis
      },
      versionHistory: versionHistory
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving document version history', 
      error: error.message 
    });
  }
};

// Get a specific historical version of a document
export const getHistoricalVersion = async (req, res) => {
  try {
    const { historyId } = req.params;
    
    // Find the specific history entry
    const historyEntry = await DocumentHistory.findById(historyId);
    if (!historyEntry) {
      return res.status(404).json({ message: 'History entry not found' });
    }
    
    // Verify user has access to this document
    const document = await Document.findById(historyEntry.documentId);
    if (!document || document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json({
      message: 'Historical version retrieved successfully',
      documentInfo: {
        documentId: historyEntry.documentId,
        fileName: historyEntry.fileName,
        fileType: historyEntry.fileType,
        version: historyEntry.version,
        timestamp: historyEntry.timestamp
      },
      analysis: historyEntry.analysisSnapshot
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving historical version', 
      error: error.message 
    });
  }
};

// Create a history entry after document analysis
export const createHistoryEntry = async (document) => {
  try {
    // Get highest version number for this document
    const latestVersion = await DocumentHistory.findOne({ documentId: document._id })
      .sort({ version: -1 });
    
    const newVersion = latestVersion ? latestVersion.version + 1 : 1;
    
    // Create new history entry
    const historyEntry = new DocumentHistory({
      documentId: document._id,
      userId: document.uploadedBy,
      version: newVersion,
      timestamp: new Date(),
      fileName: document.fileName,
      fileType: document.fileType,
      analysisSnapshot: document.analysis
    });
    
    await historyEntry.save();
    console.log(`Created history entry version ${newVersion} for document ${document.fileName}`);
    
    return historyEntry;
  } catch (error) {
    console.error('Error creating history entry:', error);
    return null;
  }
};

export default {
  getUserDocumentHistory,
  getDocumentVersionHistory,
  getHistoricalVersion,
  createHistoryEntry
};

