import mongoose from 'mongoose';


const documentHistorySchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number, 
        required: true,
        default: 1, 
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
  // This will snapshot analysis of the document at this version
    analysisSnapshot: {
        summary: String,
        keyTopics: [String],
        financialFigures: String,
        actionItems: String,
        analyzedAt: Date
    }
}); 


// Index to improve the query performance 
documentHistorySchema.index({ documentId: 1, version: -1 });
documentHistorySchema.index({userId: 1, timestamp: -1});

const DocumentHistory = mongoose.model('DocumentHistory', documentHistorySchema);

export default DocumentHistory;