const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middelwares/auth.js");
const { isEditDataValid } = require("../utils/isvalidate.js");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //console.log("reached");
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!isEditDataValid(req)) {
      throw new Error("Invalid credentials");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const DbPassword = logedInUser.password;
    const userCurrentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    const isBothSame = await bcrypt.compare(userCurrentPassword, DbPassword);
    if (!isBothSame) {
      throw new Error("invaild password");
    }
    const hashOfNewPassword = await bcrypt.hash(newPassword, 10);
    logedInUser.password = hashOfNewPassword;
    await logedInUser.save();
    //console.log(logedInUser.password);
    res.json({ messege: "password updated successfully", data: logedInUser });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

module.exports = { profileRouter };
