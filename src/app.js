const express = require("express");

const { connectDB } = require("./config/database.js");

const User = require("./modals/user.js");
const { model } = require("mongoose");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  //console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(400).send("not added the user " + err);
  }
});

app.get("/feed", async (req, res) => {
  //const useremail = req.body.email;
  //console.log(useremail);
  const user = await User.find({});
  try {
    if (user.length === 0) {
      res.send("user not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("something went wrong");
  }
});

app.get("/getuserbyemail", async (req, res) => {
  const useremail = req.body.email;
  const user = await User.findOne({ email: useremail });
  try {
    if (!user) {
      res.send("user do not exist");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("somthing went wrong");
  }
});

app.delete("/deleteuser", async (req, res) => {
  const userId = req.body._id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send(deletedUser);
  } catch (error) {
    res.status(404).send("somthing went wrong");
  }
});

app.patch("/updateuser", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;
  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
  });
  res.send(updatedUser);
});

connectDB()
  .then(() => {
    console.log("connected to db successful");
    app.listen(1008, () => {
      console.log("server is listening to port number 1008");
    });
  })
  .catch((err) => {
    console.log("not connected to db");
  });
