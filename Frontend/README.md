# CFO Agenda Creator - Frontend

This is the frontend application for the CFO Agenda Creator, built with React and Vite.

## Features

- Document upload and analysis
- AI-powered document topic extraction
- Topic approval workflow
- Export functionality for documents
- User authentication and profile management

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Login to Vercel: `vercel login`
4. Deploy: `vercel` (from the project directory)

Alternatively, you can deploy through the Vercel web interface:

1. Push your code to a GitHub repository
2. Log in to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure the project (the defaults should work fine)
5. Click "Deploy"

## Environment Variables

Make sure to set up the following environment variables in your Vercel project:

- `VITE_API_URL`: URL of your backend API (e.g., https://cfo-agenda-creator.herokuapp.com)
