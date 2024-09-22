const { connectToDB } = require("./config/database.js");
const User = require("./models/user.js");
const express = require("express");
const app = express();
var validator = require('validator');
require("dotenv").config();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = req.body;
  const email = req.body.email;
  const isValidEmail =  validator.isEmail(email);
  
  if(!isValidEmail) {
    throw new Error("email not valid")
  }

  if (userData.skills.length > 10) {
    throw new Error("skills cannot be more than 10");
  }

  const user = new User(userData);
  try {
    await user.save();
    res.status(200).send("user created successfully");
  } catch (err) {
    res.status(500).send("Error creating user " + err.message);
  }
});

// getting all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "skills",
    "age",
    "gender",
    "about",
    "profilePhotoUrl",
  ];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Cannot updates those fields");
    }

    if (data.skills.length > 10) {
      throw new Error("skills cannot be more than 10");
    }

    const updatedValues = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });
    console.log(updatedValues);

    res.status(200).send("user updated successfully");
  } catch (err) {
    res.send("error occured" + err.message);
  }
});

const PORT = 4000;

connectToDB().then(() =>
  app.listen(PORT, () => {
    console.log("server is listening on  port", PORT);
  })
);
