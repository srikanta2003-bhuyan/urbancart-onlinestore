const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://admin:ansh123@cluster0.ryrt9l8.mongodb.net/urbancart";

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌:", error);
    process.exit(1);
  }
};

module.exports = connectDB;