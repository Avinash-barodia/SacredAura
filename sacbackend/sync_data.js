require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to local MongoDB");
    
    try {
        // Fetch remote data
        console.log("Fetching categories from render...");
        const catRes = await fetch("https://sacredaurabackend.onrender.com/api/categories");
        const categories = await catRes.json();
        
        console.log("Fetching products from render...");
        const prodRes = await fetch("https://sacredaurabackend.onrender.com/api/products");
        const products = await prodRes.json();

        // Clear local collections
        await Category.deleteMany({});
        await Product.deleteMany({});
        
        console.log("Inserting categories...");
        await Category.insertMany(categories);
        
        console.log("Inserting products...");
        // Handle products
        const productsToInsert = products.map(p => {
            // keep the same _id so references don't break
            return p;
        });
        
        await Product.insertMany(productsToInsert);
        
        console.log(`Successfully synced ${categories.length} categories and ${products.length} products to local database!`);
    } catch(err) {
        console.error("Error syncing data:", err.message);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
