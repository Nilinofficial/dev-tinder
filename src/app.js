const {authUser} = require('./middleware/auth.js')
const express = require("express");
const app = express();

const PORT = 4000;

app.use("/user",authUser);
app.use("/user/details",(req,res) => {
res.status(200).send("user found")
})

app.listen(PORT, () => {
  console.log("server is listening on  port", PORT);
});
