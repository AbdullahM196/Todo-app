require("dotenv").config();
const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database is connected");
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = dbConnect;
