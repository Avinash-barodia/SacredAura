require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require("mongoose");
const uri = "mongodb://avinashbarodiya800_db_user:Avinash1229@ac-omgzybi-shard-00-00.kxtqeje.mongodb.net:27017,ac-omgzybi-shard-00-01.kxtqeje.mongodb.net:27017,ac-omgzybi-shard-00-02.kxtqeje.mongodb.net:27017/?ssl=true&replicaSet=atlas-omgzybi-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    family: 4
  })
  .then(() => {
    console.log("MongoDB Connected Direct");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
