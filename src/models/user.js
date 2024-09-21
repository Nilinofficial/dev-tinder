const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLenth: 20,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLenth: 20,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    // trim is used to remove white space
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
  gender: {
    type: String,
    required: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Enter a valid gender");
      }
    },
  },
  profilePhotoUrl: {
    type: String,
  },
  about: {
    type: String,
  },
  skills: {
    type: [String],
  },
},
{
  timestamps:true
}

);

// Model should start with Capital letter
// like a class
const User = mongoose.model("User", userSchema);
module.exports = User;
