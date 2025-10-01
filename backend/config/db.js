const mongoose = require('mongoose');

let isConnected = false;

// Connect to MongoDB if URI provided, else fallback to memory
async function connectDB(uri) {
  if (!uri) {
    console.log('⚠️ No MongoDB URI provided. Using in-memory store only.');
    return;
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed, using in-memory store:', err.message);
  }
}

function dbStatus() {
  return isConnected;
}

// ✅ Export properly as an object
module.exports = { connectDB, dbStatus };
