import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Log connection attempt and URI for debugging (mask password)
    const uriForLogging = process.env.MONGODB_URI
      ? process.env.MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@')
      : 'MONGODB_URI is not defined';
    console.log(`Attempting to connect to MongoDB with URI: ${uriForLogging}`);
    
    // Add connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Full error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    
    // More detailed error logging for Heroku troubleshooting
    if (error.name === 'MongoNetworkError') {
      console.error('Network error - check if MongoDB Atlas IP whitelist includes 0.0.0.0/0 for Heroku');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Server selection error - check your connection string and network settings');
    } else if (error.name === 'MongoParseError') {
      console.error('MongoDB URI parsing error - check the format of your connection string');
    }
    
    process.exit(1);
  }
};

export default connectDB;