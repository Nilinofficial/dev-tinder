const { connectToDB } = require("./config/database.js");
const User = require("./models/user.js");
const express = require("express");
const app = express();
const { validateSignUp } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");

const { userAuth } = require("./middleware/auth.js");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, gender, age } = req.body;

  try {
    await validateSignUp(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
      age,
    });
    await user.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    if (validPassword) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.status(200).send("user logged in");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

const PORT = 4000;

connectToDB().then(() =>
  app.listen(PORT, () => {
    console.log("server is listening on  port", PORT);
  })
);
