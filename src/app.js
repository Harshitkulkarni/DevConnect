const express = require("express");

const app = express();

app.use("/contact", (req, res) => {
  console.log("Request received at /");
  res.send("jai shree ram");
});

app.use("/home", (req, res) => {
  console.log("Request received at /home");
  res.send("Hare krishna");
});

app.use("/about", (req, res) => {
  console.log("Request received at /about");
  res.send("Radha radha");
});

app.listen(3000, () => {
  console.log("server is listening to port number 3000");
});
