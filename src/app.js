const { connectToDB } = require("./config/database.js");
const User = require("./models/user.js");
const express = require("express");
const app = express();
const { validateSignUp } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");

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
    res.status(200).send("user created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid Credentials");
    }
    if (validPassword) {
      // create a JWT Token
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY);

      // sending cookie after successful login
      res.cookie("token", token);
      res.status(200).send("user logged in");
    }
  } catch (err) {
    res.status(400).send(err.message);
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

app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = req.cookies;
  console.log(cookies);
  if (!token) {
    return res.status(401).send("You need to login to fetch the profile");
  }

  try {
    const decodedId = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    console.log(decodedId);

    const user = await User.findOne({ _id: decodedId._id });
    console.log(user);

    if (user) {
      res.send("profile fetched successfully");
    } else {
      return res.status(400).send("Invalid token or user not found");
    }
  } catch (err) {
    return res.status(400).send("Invalid token or error fetching profile");
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
