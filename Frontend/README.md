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

## Deployment to Render

This project is configured for easy deployment to Render:

1. Create a Render account at [render.com](https://render.com)
2. Log in to your Render dashboard
3. Click "New" and select "Web Service"
4. Connect your GitHub repository
5. Select the Frontend directory as your project root
6. Configure the service with the following settings:
   - **Name**: cfo-agenda-creator-frontend (or your preferred name)
   - **Environment**: Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
7. Add the environment variable:
   - `VITE_API_URL`: `https://cfo-agenda-creator.herokuapp.com`
8. Click "Create Web Service"

Alternatively, you can use the provided `render.yaml` configuration file:

1. Push your code to a GitHub repository
2. Log in to [render.com](https://render.com)
3. Click "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and configure the deployment

## Environment Variables

Make sure to set up the following environment variables in your Render project:

- `VITE_API_URL`: URL of your backend API (e.g., https://cfo-agenda-creator.herokuapp.com)
