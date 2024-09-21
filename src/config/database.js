const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}`);
    console.log("connected to db successfully");
  } catch (err) {
    console.log("error in connecting to db");
  }
};

module.exports = { connectToDB };
