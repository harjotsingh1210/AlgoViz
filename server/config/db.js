require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 DNS resolution (fixes common Windows SRV lookup failures)
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set in .env file');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,  // Force IPv4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`\n❌ MongoDB connection failed: ${err.message}`);

    // Friendly error hints
    if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
      console.error('\n💡 Possible fixes:');
      console.error('   1. Check your internet connection');
      console.error('   2. In Atlas → Network Access → add 0.0.0.0/0 (allow all IPs)');
      console.error('   3. Try the standard (non-SRV) connection string from Atlas');
      console.error('   4. Check if your firewall is blocking port 27017');
    } else if (err.message.includes('Authentication')) {
      console.error('\n💡 Wrong username or password in MONGO_URI');
    } else if (err.message.includes('MONGO_URI is not set')) {
      console.error('\n💡 Make sure server/.env file exists with MONGO_URI set');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
