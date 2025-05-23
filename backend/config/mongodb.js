const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.name}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
