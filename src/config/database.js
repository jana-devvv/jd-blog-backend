const mongoose = require('mongoose')

const connectMongoDb = async () => {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB:", error);
      process.exit(1)
    });
};

module.exports = connectMongoDb