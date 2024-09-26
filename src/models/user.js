const mongoose = require("mongoose");
const { Schema } = mongoose;
var validator = require("validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
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
      validate(value) {
        const isEmailValid = validator.isEmail(value);

        if (!isEmailValid) {
          throw new Error("email not valid mahn..");
        }
      },
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
      validate(value) {
        const isURLValid = validator.isURL(value);

        if (!isURLValid) {
          throw new Error("email not valid mahn..");
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateJWTToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordFromUser) {
  const isValidPassword = await bcrypt.compare(passwordFromUser, this.password);
  return isValidPassword;
};

// Model should start with Capital letter
// like a class
const User = mongoose.model("User", userSchema);
module.exports = User;
