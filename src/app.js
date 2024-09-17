const express = require("express");
const app = express();

const PORT = 4000;

app.use("/",(req, res) => {
  res.send(`server started`);
});
app.use("/dashboard",(req, res) => {
    res.send(`server dashboard started`);
  });

app.listen(PORT, () => {
  console.log("server is listening on  port", PORT);
});
