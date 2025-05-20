import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Document from '../models/Document.js';
import { processDocument } from '../services/documentAnalysisService.js';

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
      uploadedBy: req.user._id
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

// Delete a document (remove if wrong document was uploaded)
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
    console.log(`Document details - ID: ${document._id}, Type: ${document.fileType}, Path: ${document.filePath}`);
    
    // Process the document
    console.log('Calling processDocument function...');
    const analysisResult = await processDocument(document);
    console.log(`Analysis result received - Success: ${analysisResult.success}`);
    
    if (analysisResult.success) {
      // Parse the analysis results
      const analysis = analysisResult.analysis;
      console.log('Analysis content received, parsing sections...');
      
      // Extract structured data from the analysis text
      const sections = analysis.split(/\d+\.\s+/).filter(Boolean);
      console.log(`Parsed ${sections.length} sections from analysis`);
      
      // Update the document with analysis results
      console.log(`Updating document ${document._id} with analysis results...`);
      await Document.findByIdAndUpdate(document._id, {
        analyzed: true,
        analysis: {
          summary: sections[0] || '',
          keyTopics: sections[1] ? sections[1].split(/\n+/).filter(Boolean).map(topic => topic.trim()) : [],
          financialFigures: sections[2] || '',
          actionItems: sections[3] || '',
          rawAnalysis: analysis,
          analyzedAt: new Date()
        }
      });
      
      console.log(`Analysis completed for document: ${document.fileName}`);
    } else {
      console.error(`Analysis failed for document: ${document.fileName}`, analysisResult.message);
    }
  } catch (error) {
    console.error(`Error analyzing document ${document.fileName}:`, error);
    console.error(error.stack); // Log the full stack trace
  }
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

    res.status(200).json({
      message: 'Document analysis retrieved successfully',
      analyzed: true,
      analysis: {
        summary: document.analysis.summary,
        keyTopics: document.analysis.keyTopics,
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