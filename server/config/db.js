const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanagement';
    
    // Clean up accidental surrounding quotes if pasted into dashboard UI with quotes
    if (typeof uri === 'string') {
      uri = uri.trim().replace(/^["']|["']$/g, '');
    }

    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
