require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
        const client = mongoose.connection.client;
        const db1 = client.db('sacredaura');
        const p1 = await db1.collection('products').countDocuments();
        console.log(`sacredaura products count: ${p1}`);

        const db2 = client.db('test');
        const p2 = await db2.collection('products').countDocuments();
        console.log(`test products count: ${p2}`);
    } catch(err) {
        console.error("Error:", err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
