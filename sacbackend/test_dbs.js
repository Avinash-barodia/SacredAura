require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
        const adminDb = mongoose.connection.client.db('admin').admin();
        const dbs = await adminDb.listDatabases();
        console.log("Databases:");
        for(let db of dbs.databases) {
            console.log(` - ${db.name} (size: ${db.sizeOnDisk})`);
        }
    } catch(err) {
        console.error("Error listing databases:", err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
