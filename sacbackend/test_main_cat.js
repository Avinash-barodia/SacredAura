require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const cats = await db.collection('categories').find({ parent: null }).toArray();
    const mainCatIds = cats.map(c => c._id);
    const prods = await db.collection('products').find({ category: { $in: mainCatIds } }).toArray();
    console.log('Products assigned to MAIN categories:', prods.length);
    process.exit(0);
});
