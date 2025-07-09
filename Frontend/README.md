# CFO Agenda Creator - Frontend

## Overview

The CFO Agenda Creator is a professional web application designed to help finance executives create, manage, and optimize their meeting agendas. The frontend is built with React and provides a modern, responsive user interface with secure authentication, document management, and profile customization features.

## Features

### User Authentication
- Secure login and signup with email verification
- Multi-step registration process collecting personal, company, and role information
- Session management with automatic timeout after 8 hours of inactivity
- Secure password handling with strength requirements

### Document Management
- Upload financial documents for agenda creation
- View document history with pagination
- Process documents to extract key financial insights
- Export results in various formats

### User Profile
- Customizable user profiles with company and position information
- Profile image upload and management
- Document history tracking
- Account statistics and membership duration

### Navigation & UI
- Responsive design that works on desktop and mobile devices
- Dynamic navigation based on authentication status
- Modern UI with gradient backgrounds, animations, and interactive elements
- Consistent styling across all pages with a professional color scheme

## Technology Stack

- **Framework**: React with Vite for fast development and optimized builds
- **Routing**: React Router for seamless navigation
- **Styling**: Tailwind CSS for responsive design
- **Icons**: React Icons library
- **HTTP Client**: Axios for API communication
- **State Management**: React hooks and context
- **Authentication**: JWT token-based authentication with expiration

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/         # Shared components used across pages
│   ├── signup/         # Components specific to the signup flow
│   └── Navbar.jsx      # Global navigation component
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Authentication page
│   ├── Profile.jsx     # User profile management
│   ├── Results.jsx     # Document processing results
│   ├── Signup.jsx      # User registration
│   └── Upload.jsx      # Document upload interface
├── utils/              # Utility functions and helpers
│   ├── authUtils.js    # Authentication utilities with token expiration
│   ├── localStorage.js  # Local storage management
│   └── passwordStrength.js # Password validation utilities
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## Authentication Flow

The application implements a secure authentication system with:

1. **Token-based Authentication**: JWT tokens stored in localStorage with expiration
2. **Session Management**: Automatic logout after 8 hours of inactivity
3. **Activity Tracking**: Session extension based on user activity
4. **Secure Redirects**: Unauthorized users are redirected to public pages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cfo-agenda-creator.git
   cd cfo-agenda-creator/Frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## API Integration

The frontend communicates with a Node.js/Express backend API. Key endpoints include:

- `/api/users/signup` - User registration
- `/api/users/login` - User authentication
- `/api/profile` - User profile management
- `/api/profile/documents` - Document history
- `/api/upload` - Document upload and processing

## UI/UX Features

- **Consistent Design Language**: Professional indigo/purple gradient theme throughout
- **Responsive Components**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects, transitions, and animations
- **User Feedback**: Loading indicators, success/error messages
- **Accessibility**: Semantic HTML and keyboard navigation

## Future Enhancements

- Dark/light theme toggle
- Enhanced document analytics
- Collaborative agenda sharing
- Calendar integration
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.
