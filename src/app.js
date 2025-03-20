const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database.js");
const cros = require("cors");
const http = require("http");
const app = express();

app.use(
  cros({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
const { userRouter } = require("./routes/user.js");
const initilizeSocket = require("./routes/socket.js");
const chatRouter = require("./routes/chat.js");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

require("dotenv").config();

const server = http.createServer(app);
initilizeSocket(server);

connectDB()
  .then(() => {
    console.log("connected to db successful");
    server.listen(process.env.PORT, () => {
      console.log("server is listening to port number 7777");
    });
  })
  .catch((err) => {
    console.log("not connected to db" + err.message);
  });
