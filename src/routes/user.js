const expres = require("express");

const userRouter = expres.Router();
const { userAuth } = require("../middelwares/auth");
const requestInstance = require("../modals/connectionRequest");
const UserInstance = require("../modals/user");

userRouter.get("/user/request/recived", userAuth, async (req, res) => {
  try {
    logedInUser = req.user;
    const connectionRequest = await requestInstance
      .find({
        toUserId: logedInUser._id,
        status: "intrested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoURL",
        "skills",
        "bio",
      ]);

    res.json({
      messsage: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(404).send("somthing went wrong");
  }
});

userRouter.get("/user/view/connections", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;

    const connectionRequest = await requestInstance
      .find({
        $or: [
          { toUserId: logedInUser._id, status: "accepted" },
          { fromUserId: logedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoURL",
        "skills",
        "bio",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoURL",
        "skills",
        "bio",
      ]);
    if (connectionRequest.length === 0) {
      return res.send("no connection found");
    }

    // beacuse we are fetching data for or conditions the data may come from fromUserId or toUserId
    //therefore if the data is comming from fromUserId then  we ne to display toUserId
    // or if the data is comming from toUserId then we need to display fromUserId
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === logedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send("Error : " + error.messsage);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const logedInUser = req.user;

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;
  const connectionRequest = await requestInstance
    .find({
      $or: [{ fromUserId: logedInUser._id }, { toUserId: logedInUser._id }],
    })
    .select("fromUserId toUserId");

  const hideUserFromFeed = new Set();
  connectionRequest.forEach((req) => {
    hideUserFromFeed.add(req.fromUserId.toString());
    hideUserFromFeed.add(req.toUserId.toString());
  });
  //console.log(hideUserFromFeed);
  const user = await UserInstance.find({
    $and: [
      { _id: { $nin: Array.from(hideUserFromFeed) } },
      { _id: { $ne: logedInUser._id } },
    ],
  })
    .select("firstName lastName bio skills age gender photoURL")
    .limit(limit)
    .skip(skip);
  res.send(user);
});
module.exports = { userRouter };
