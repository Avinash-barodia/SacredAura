require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    try {
        const client = mongoose.connection.client;
        const db = client.db('sample_mflix');
        const count = await db.collection('products').countDocuments();
        console.log(`sample_mflix products count: ${count}`);
    } catch(err) {
        console.error("Error:", err);
    }
    process.exit(0);
  });
