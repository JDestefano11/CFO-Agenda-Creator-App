import Document from '../models/Document.js';
import { 
  generateDocumentExportContent, 
  updateExportContent, 
  finalizeExportContent 
} from '../services/documentExportService.js';
import { createHistoryEntry } from './documentHistoryController.js';

/**
 * Generate export content for a document
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const generateExport = async (req, res) => {
  try {
    const { outputType, primaryStakeholder, customOutputType } = req.body;
    
    // Validate required parameters
    if (!outputType || !primaryStakeholder) {
      return res.status(400).json({ 
        message: 'Output type and primary stakeholder are required' 
      });
    }
    
    // Validate output type
    const validOutputTypes = ['agenda', 'survey', 'email', 'other'];
    if (!validOutputTypes.includes(outputType)) {
      return res.status(400).json({ 
        message: `Invalid output type. Must be one of: ${validOutputTypes.join(', ')}` 
      });
    }
    
    // If output type is 'other', customOutputType is required
    if (outputType === 'other' && !customOutputType) {
      return res.status(400).json({
        message: 'Custom output type is required when output type is set to "other"'
      });
    }
    
    // Validate stakeholder - allow any stakeholder as we now support custom ones
    // Just ensure it's not empty
    if (!primaryStakeholder || primaryStakeholder.trim() === '') {
      return res.status(400).json({ 
        message: 'Primary stakeholder cannot be empty' 
      });
    }
    
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if document has been analyzed
    if (!document.analyzed) {
      return res.status(400).json({ 
        message: 'Document must be analyzed before export can be generated' 
      });
    }
    
    // Generate export content
    const result = await generateDocumentExportContent(document, outputType, primaryStakeholder);
    
    if (!result.success) {
      return res.status(500).json({ 
        message: result.message || 'Failed to generate export content' 
      });
    }
    
    // Update document with export information
    document.export = {
      outputType,
      customOutputType: outputType === 'other' ? customOutputType : undefined,
      primaryStakeholder,
      content: result.content,
      generatedAt: new Date()
    };
    
    await document.save();
    
    // Create history entry
    try {
      await createHistoryEntry(document, 'Export content generated');
    } catch (historyError) {
      console.error(`Failed to create history entry:`, historyError);
      // Continue even if history creation fails
    }
    
    res.status(200).json({
      message: 'Export content generated successfully',
      export: {
        outputType,
        customOutputType: outputType === 'other' ? customOutputType : undefined,
        primaryStakeholder,
        content: result.content,
        generatedAt: document.export.generatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error generating export content', 
      error: error.message 
    });
  }
};

/**
 * Update export content with user modifications
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const updateExport = async (req, res) => {
  try {
    const { modifiedContent } = req.body;
    
    // Validate required parameters
    if (!modifiedContent) {
      return res.status(400).json({ 
        message: 'Modified content is required' 
      });
    }
    
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if document has export content
    if (!document.export || !document.export.content) {
      return res.status(400).json({ 
        message: 'No export content found. Generate export content first.' 
      });
    }
    
    // Update export content
    const result = await updateExportContent(document, modifiedContent);
    
    if (!result.success) {
      return res.status(500).json({ 
        message: result.message || 'Failed to update export content' 
      });
    }
    
    // Update document with modified content
    document.export.modifiedContent = result.content;
    
    await document.save();
    
    // Create history entry
    try {
      await createHistoryEntry(document, 'Export content modified');
    } catch (historyError) {
      console.error(`Failed to create history entry:`, historyError);
      // Continue even if history creation fails
    }
    
    res.status(200).json({
      message: 'Export content updated successfully',
      export: {
        outputType: document.export.outputType,
        customOutputType: document.export.outputType === 'other' ? document.export.customOutputType : undefined,
        primaryStakeholder: document.export.primaryStakeholder,
        content: document.export.content,
        modifiedContent: document.export.modifiedContent,
        generatedAt: document.export.generatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating export content', 
      error: error.message 
    });
  }
};

/**
 * Finalize export content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const finalizeExport = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if document has export content
    if (!document.export || !document.export.content) {
      return res.status(400).json({ 
        message: 'No export content found. Generate export content first.' 
      });
    }
    
    // Finalize export content
    const result = await finalizeExportContent(document);
    
    if (!result.success) {
      return res.status(500).json({ 
        message: result.message || 'Failed to finalize export content' 
      });
    }
    
    // Update document finalized timestamp
    document.export.finalizedAt = new Date();
    
    await document.save();
    
    // Create history entry
    try {
      await createHistoryEntry(document, 'Export content finalized');
    } catch (historyError) {
      console.error(`Failed to create history entry:`, historyError);
      // Continue even if history creation fails
    }
    
    // Prepare the finalized content
    const finalContent = document.export.modifiedContent || document.export.content;
    
    res.status(200).json({
      message: 'Export finalized successfully',
      export: {
        outputType: document.export.outputType,
        customOutputType: document.export.outputType === 'other' ? document.export.customOutputType : undefined,
        primaryStakeholder: document.export.primaryStakeholder,
        finalContent,
        finalizedAt: document.export.finalizedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error finalizing export', 
      error: error.message 
    });
  }
};

/**
 * Get export information for a document
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getExport = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if document has export
    if (!document.export || !document.export.content) {
      return res.status(404).json({ 
        message: 'No export found for this document' 
      });
    }
    
    res.status(200).json({
      message: 'Export retrieved successfully',
      export: {
        outputType: document.export.outputType,
        customOutputType: document.export.outputType === 'other' ? document.export.customOutputType : undefined,
        primaryStakeholder: document.export.primaryStakeholder,
        content: document.export.content,
        modifiedContent: document.export.modifiedContent,
        generatedAt: document.export.generatedAt,
        finalizedAt: document.export.finalizedAt,
        isFinalized: !!document.export.finalizedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving export', 
      error: error.message 
    });
  }
};

export default {
  generateExport,
  updateExport,
  finalizeExport,
  getExport
};