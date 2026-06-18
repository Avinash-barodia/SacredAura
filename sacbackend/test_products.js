require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);
        if(products.length > 0) {
            console.log(products[0]);
        }
    } catch(err) {
        console.error("Error finding products:", err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
