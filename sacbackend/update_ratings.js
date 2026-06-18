require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("Connected to local MongoDB");
    
    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products. Updating ratings...`);

        let count = 0;
        for (let p of products) {
            // Generate a random rating between 4.5 and 4.8
            // Math.random() is [0, 1), so Math.random() * 0.3 is [0, 0.3)
            // Adding 4.5 gives [4.5, 4.8)
            // We round it to 1 decimal place using toFixed(1) and then parse to float
            const newRating = parseFloat((Math.random() * 0.3 + 4.5).toFixed(1));
            
            // Random review count between 10 and 150
            const reviewCount = Math.floor(Math.random() * 140) + 10;
            
            // Assuming reviews might be an array, or just a number depending on schema
            // Let's create mock reviews array
            const mockReviews = Array(reviewCount).fill({ rating: newRating, comment: "Great product!" });

            p.rating = newRating;
            p.reviews = mockReviews;
            
            await p.save();
            count++;
        }
        
        console.log(`Successfully updated ratings for ${count} products!`);
    } catch(err) {
        console.error("Error updating ratings:", err.message);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
