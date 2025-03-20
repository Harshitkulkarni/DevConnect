const express = require("express");
const { userAuth } = require("../middelwares/auth");
const { Chat } = require("../modals/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:toUserId", userAuth, async (req, res) => {
  const fromUserId = req.user._id;
  const { toUserId } = req.params;
  //console.log(fromUserId);
  //console.log(toUserId);
  const chat = await Chat.findOne({
    participents: { $all: [fromUserId, toUserId] },
  }).populate({
    path: "message.senderId",
    select: "firstName lastName photoURL",
  });
  if (!chat) {
    chat = new Chat({
      participents: [fromUserId, toUserId],
      message: [],
    });
    await chat.save();
  }

  res.json(chat);
});

module.exports = chatRouter;
