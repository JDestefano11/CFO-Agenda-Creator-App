# CFO Agenda Creator - Backend Service

## Overview

This repository contains the backend service for the CFO Agenda Creator platform. It provides the API and data processing capabilities that power document analysis, version history tracking, and content generation features for the frontend application.

## Backend Features

### Document Processing Engine
- **Multi-Format Support**: Process PDF, Word (.doc, .docx), Excel (.xls, .xlsx), and text files
- **Robust Text Extraction**: Extract content using multiple fallback mechanisms to handle corrupted files
- **In-Memory Processing**: Buffer-based document handling without saving to disk

### AI Analysis Integration
- **OpenAI Integration**: Extract key topics, financial figures, and action items from documents
- **Structured Response Formatting**: Consistent organization of analysis results
- **Error Handling**: Graceful handling of API failures and rate limits

### Document History System
- **Version Tracking**: Record document versions and changes over time
- **Analysis Snapshots**: Store point-in-time snapshots of document analysis
- **History Retrieval API**: Endpoints to access historical document states

### User Authentication
- **JWT-Based Auth**: Secure endpoints with JSON Web Tokens
- **Role Verification**: Ensure users can only access their own documents
- **Password Hashing**: Secure storage of user credentials

## Technical Stack

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB for document and user storage
- **Authentication**: JWT token-based authentication
- **AI Provider**: OpenAI API integration
- **Document Processing**: Custom document parsing logic with libraries:
  - pdf-parse for PDF files
  - mammoth for Word documents
  - xlsx for Excel spreadsheets

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login and token generation

### Document Management
- `POST /api/documents/upload` - Upload and analyze document
- `GET /api/documents/user` - Get all documents for current user
- `GET /api/documents/:id/analysis` - Get analysis for specific document
- `DELETE /api/documents/:id` - Delete document

### Document History
- `GET /api/history/user-history` - Get document history for current user
- `GET /api/history/document/:documentId` - Get history for specific document

## Architecture Design

The backend follows a modular architecture:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic for document processing
- **Models**: Define data schemas and database interactions
- **Middleware**: Handle authentication and request validation
- **Routes**: Define API endpoints and connect to controllers

## Current Development Focus

- Document history tracking system implementation
- Robust document text extraction for all file types
- Secure document storage and retrieval
- Integration with OpenAI for intelligent analysis

## Security Considerations

- All document content is stored in MongoDB, not on the filesystem
- User authentication is required for all document operations
- Document access is restricted to the original uploader
- No sensitive data is logged or exposed in responses
