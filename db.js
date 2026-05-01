const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urbancart";

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌:", error);
    process.exit(1);
  }
};

module.exports = connectDB;