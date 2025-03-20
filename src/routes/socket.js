const socket = require("socket.io");
const { Chat } = require("../modals/chat");
const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // we will handle events

    socket.on("joinChat", ({ fromUserId, toUserId }) => {
      const roomId = [fromUserId, toUserId].sort().join("_");
      //console.log(roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ fromUserId, toUserId, firstName, lastName, photoURL, text }) => {
        //console.log(firstName + " " + text + "     " + photoURL);
        try {
          const roomId = [fromUserId, toUserId].sort().join("_");

          let chat = await Chat.findOne({
            participents: { $all: [fromUserId, toUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participents: [fromUserId, toUserId],
              message: [],
            });
          }

          chat.message.push({
            senderId: fromUserId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("recivedMessage", { firstName, text, photoURL });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
