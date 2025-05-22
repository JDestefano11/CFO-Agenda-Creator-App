import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileType: {
    type: String,
    required: [true, 'File type is required']
  },
  fileContent: {
    type: Buffer,
    required: [true, 'File content is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  analyzed: {
    type: Boolean,
    default: false
  },
  analysis: {
    summary: String,
    keyTopics: [String],
    financialFigures: String,
    actionItems: String,
    rawAnalysis: String,
    analyzedAt: Date
  }, 
  export: {
    outputType: {
      type: String, 
      enum: ['email', 'agenda', 'survey', 'other'],
    },
    customOutputType: String,
    primaryStakeholder: {
      type: String, 
      enum: ['CFO', 'VP of Finance', 'Head of Accounting'],
    },
    content: String, 
    generatedAt: Date,
    modifiedContent: String, 
    finalizedAt: Date
  }
});

const Document = mongoose.model('Document', documentSchema);

export default Document;