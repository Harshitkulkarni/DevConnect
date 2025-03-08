const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("connected to db successful");
    app.listen(1008, () => {
      console.log("server is listening to port number 1008");
    });
  })
  .catch((err) => {
    console.log("not connected to db" + err.message);
  });
