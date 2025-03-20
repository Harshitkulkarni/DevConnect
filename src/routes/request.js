const express = require("express");
const { userAuth } = require("../middelwares/auth");
const requestRouter = express.Router();
const requestInstance = require("../modals/connectionRequest");
const UserInstance = require("../modals/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    fromUserId = req.user._id;
    toUserId = req.params.toUserId;
    //console.log(toUserId);
    status = req.params.status;
    //console.log(status);

    const allowedStatus = ["ignored", "intrested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Error status type");
    }
    if (fromUserId == toUserId) {
      return res.status(400).send("connot send request to userself");
    }
    const user = await UserInstance.findById(toUserId);
    if (!user) {
      return res.status(400).send("user does not exist");
    }
    const exestingconnectionrequest = await requestInstance.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (exestingconnectionrequest) {
      return res.status(400).send(" connection request already exist");
    }
    const connectionRequest = new requestInstance({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      messege: `${req.user.firstName} is ${status} in  ${user.firstName}`,
      data,
    });
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      logedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error(`invaild status ${status} is not allowed`);
      }

      const connectionRequest = await requestInstance.findOne({
        _id: requestId,
        toUserId: logedInUser._id,
        status: "intrested",
      });
      if (!connectionRequest) {
        throw new Error("invaild connection request");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection request " + status, data });
    } catch (error) {
      res.status(404).send("Error " + error.message);
    }
  }
);

module.exports = { requestRouter };
