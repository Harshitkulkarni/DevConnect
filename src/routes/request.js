const express = require("express");
const { userAuth } = require("../middelwares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendconnection", userAuth, async (req, res) => {
  user = req.user;
  res.send(user.firstName + " sent the connection request");
});

module.exports = { requestRouter };
