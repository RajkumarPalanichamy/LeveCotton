const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://thinkzera_db_user:uMBK4aGSHlen12YJ@levecotton.bcmq2j5.mongodb.net/levecotton?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true';

const options = {
  serverSelectionTimeoutMS: 5000,
};

async function testConnection() {
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db('levecotton');
    const productsCount = await db.collection('products').countDocuments();
    console.log(`📦 Products in database: ${productsCount}`);
    
    if (productsCount === 0) {
      console.log('🌱 Database is empty, will auto-seed on first API call');
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();