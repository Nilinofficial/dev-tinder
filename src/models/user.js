const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  age: Number,
  gender: {
    type: String,
  },
});

// Model should start with Capital letter
// like a class
const User = mongoose.model("User", userSchema);
module.exports = User;
