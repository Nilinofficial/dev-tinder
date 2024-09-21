const { connectToDB } = require("./config/database.js");
const User = require("./models/user.js");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = req.body;
  const user = new User(userData);
  try {
    await user.save();
    res.status(200).send("user created successfully");
  } catch (err) {
    res.status(500).send("Error creating user " + err.message);
  }
});

const PORT = 4000;

connectToDB().then(() =>
  app.listen(PORT, () => {
    console.log("server is listening on  port", PORT);
  })
);
