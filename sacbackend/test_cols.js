require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
        const client = mongoose.connection.client;
        const db1 = client.db('sacredaura');
        const cols1 = await db1.listCollections().toArray();
        console.log("sacredaura collections:", cols1.map(c => c.name));

        const db2 = client.db('test');
        const cols2 = await db2.listCollections().toArray();
        console.log("test collections:", cols2.map(c => c.name));
    } catch(err) {
        console.error("Error:", err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
