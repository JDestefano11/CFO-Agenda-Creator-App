import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Document from '../models/Document.js';
import { processDocument } from '../services/documentAnalysisService.js';
import { createHistoryEntry } from '../controllers/documentHistoryController.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure memory storage for uploaded files - files will not be saved to disk
const storage = multer.memoryStorage();

// File filter to accept only PDFs and common document formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload PDF, Word, or Excel documents.'), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create document record with file content stored in MongoDB
    const document = new Document({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileContent: req.file.buffer, // Store the file buffer directly in MongoDB
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      user: req.user._id // Adding user field to match the schema requirements
    });

    await document.save();

    analyzeDocumentInBackground(document);

    res.status(201).json({
      message: 'Document uploaded successfully! Analysis in progress...',
      document: {
        id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading document',
      error: error.message
    });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }


    // Delete document from database
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// Helper function to analyze document in the background
const analyzeDocumentInBackground = async (document) => {
  try {
    console.log(`Starting analysis for document: ${document.fileName}`);
    console.log(`Document details - ID: ${document._id}, Type: ${document.fileType}`);

    const analysisService = await import('../services/documentAnalysisService.js');
    const result = await analysisService.processDocument(document);

    if (result.success) {
      console.log(`Analysis completed successfully for document: ${document.fileName}`);

      // Update document with analysis results
      const updateData = {
        analyzed: true,
        analysis: {
          summary: result.summary,
          keyTopics: result.keyTopics,
          financialFigures: result.financialFigures,
          actionItems: result.actionItems,
          analyzedAt: new Date()
        }
      };

      console.log(`Updating document with analysis results: ${document._id}`);
      const updatedDocument = await Document.findByIdAndUpdate(
        document._id,
        updateData,
        { new: true }
      );

      if (!updatedDocument) {
        console.error(`Failed to update document with analysis results: ${document._id}`);
        return;
      }

      console.log(`Document updated successfully with analysis results: ${document._id}`);

      // Create history entry using both methods to ensure it works
      try {
        // Method 1: Direct function call
        const { createHistoryEntry } = await import('../controllers/documentHistoryController.js');
        const historyEntry = await createHistoryEntry(updatedDocument);

        if (historyEntry) {
          console.log(`Created history entry for document via direct function call: ${document.fileName}, version: ${historyEntry.version}`);
        } else {
          console.error(`Failed to create history entry via direct function call for document: ${document.fileName}`);

          // Method 2: API call as fallback
          try {
            // Make an internal API call to create history
            const axios = (await import('axios')).default;
            
            // Get the token
            const token = await generateSystemToken(updatedDocument.uploadedBy);
            
            const response = await axios.post(
              `http://localhost:${process.env.PORT || 5000}/api/history/create-after-analysis/${updatedDocument._id}`,
              {},
              {
                headers: {
                  // Create a system token for internal API calls
                  Authorization: `Bearer ${token}`
                }
              }
            );

            console.log(`Created history entry via API call: ${document.fileName}`, response.data);
          } catch (apiError) {
            console.error(`Error creating history via API call for document ${document.fileName}:`, apiError.message);
          }
        }
      } catch (historyError) {
        console.error(`Error creating history entry for document ${document.fileName}:`, historyError);
        console.error(historyError.stack); // Log the full stack trace
      }

    } else {
      console.error(`Analysis failed for document: ${document.fileName}`, result.error);

      // Update document with failure status
      await Document.findByIdAndUpdate(
        document._id,
        {
          analyzed: false,
          analysisError: result.error
        }
      );
    }
  } catch (error) {
    console.error(`Error analyzing document ${document.fileName}:`, error);
    console.error(error.stack); // Log the full stack trace
  }
};

// Generate a system token for internal API calls
const generateSystemToken = (userId) => {
  // Using dynamic import for JWT to avoid issues with require
  return import('jsonwebtoken')
    .then(jwt => {
      return jwt.sign(
        { id: userId, isSystemCall: true },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '5m' } // Short expiration for security
      );
    });
};

// Middleware to handle file upload
export const uploadMiddleware = upload.single('document');

// Get all documents for the current user
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });

    const formattedDocuments = documents.map(doc => ({
      id: doc._id,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      createdAt: doc.createdAt,
      analyzed: doc.analyzed,
      // Include analysis summary if available
      analysis: doc.analyzed ? {
        summary: doc.analysis.summary,
        analyzedAt: doc.analysis.analyzedAt
      } : null
    }));

    res.status(200).json({
      message: 'Documents retrieved successfully',
      documents: formattedDocuments
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving documents',
      error: error.message
    });
  }
};

// Get document analysis
export const getDocumentAnalysis = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!document.analyzed) {
      return res.status(200).json({
        message: 'Document analysis is pending or not available',
        analyzed: false
      });
    }

    // Use only the topics generated by OpenAI
    let keyTopics = document.analysis.keyTopics || [];
    console.log(`OpenAI generated topics for document ${document._id}:`, keyTopics);
    
    res.status(200).json({
      message: 'Document analysis retrieved successfully',
      analyzed: true,
      documentName: document.name, // Include document name in response
      keyTopics: keyTopics, // Added at top level for backward compatibility
      topics: keyTopics, // Alternative name for frontend compatibility
      analysis: {
        summary: document.analysis.summary,
        keyTopics: keyTopics,
        financialFigures: document.analysis.financialFigures,
        actionItems: document.analysis.actionItems,
        analyzedAt: document.analysis.analyzedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving document analysis',
      error: error.message
    });
  }
};

// Manually trigger analysis for a document
export const analyzeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Send immediate response that analysis has started
    res.status(202).json({
      message: 'Document analysis started! We\'ll process your document and extract valuable insights. Check back soon for the results!',
      documentId: document._id
    });

    // Analyze document in the background
    analyzeDocumentInBackground(document);

  } catch (error) {
    res.status(500).json({
      message: 'Error starting document analysis',
      error: error.message
    });
  }
};

// Export multer for use in routes
export { upload };