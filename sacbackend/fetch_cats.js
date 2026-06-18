const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
}).then(async () => {
    const Category = require("./models/Category");
    const categories = await Category.find();
    console.log("Categories:", categories.map(c => c.name));
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});
