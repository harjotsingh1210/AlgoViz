/**
 * Quick MongoDB connection test
 * Run: node scripts/test-connection.js
 */
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI not found in .env file');
  process.exit(1);
}

// Mask password for safe display
const safeUri = uri.replace(/:([^@]+)@/, ':***@');
console.log('🔌 Testing connection to:', safeUri);
console.log('');

mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, family: 4 })
  .then(conn => {
    console.log('✅ SUCCESS! Connected to:', conn.connection.host);
    console.log('📁 Database:', conn.connection.name);
    console.log('');
    console.log('Your backend is ready! Run: npm run dev');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED:', err.message);
    console.error('');
    if (err.message.includes('ENOTFOUND') || err.message.includes('querySrv')) {
      console.error('🔧 Fix: Go to MongoDB Atlas → Network Access');
      console.error('   → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
      console.error('');
      console.error('   Or try the STANDARD connection string (not SRV):');
      console.error('   Atlas → Connect → Drivers → toggle OFF "SRV Connection String"');
    } else if (err.message.includes('bad auth') || err.message.includes('Authentication')) {
      console.error('🔧 Fix: Wrong password in MONGO_URI');
      console.error('   Check Atlas → Database Access → your username → Edit → Reset Password');
    }
    process.exit(1);
  });
