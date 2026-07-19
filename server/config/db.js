const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGO_URI or MONGODB_URI environment variable is missing!');
      return false;
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // DO NOT exit process in serverless environments, it causes 500 errors
    // process.exit(1);
    return false;
  }
};

module.exports = connectDB;
