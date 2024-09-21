const { connectToDB } = require("./config/database.js");
const express = require("express");
const app = express();
require('dotenv').config()


const PORT = 4000;

connectToDB().then(() =>
  app.listen(PORT, () => {
    console.log("server is listening on  port", PORT);
  })
);
