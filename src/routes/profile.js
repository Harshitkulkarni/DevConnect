const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middelwares/auth.js");
const { isEditDataValid } = require("../utils/isvalidate.js");
const { upload } = require("../middelwares/multer.js");
const { uploadTocloudinary } = require("../utils/cloudinary.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!isEditDataValid(req)) {
        throw new Error("Invalid credentials");
      }

      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );

      // **Handle Image Upload**
      if (req.file) {
        const uploadedFile = await uploadTocloudinary(req.file.path);
        console.log(uploadedFile);

        loggedInUser.photoURL = uploadedFile?.url;
      }

      await loggedInUser.save();

      res.json({
        message: `${loggedInUser.firstName} profile updated successfully`,
        data: loggedInUser,
      });
    } catch (error) {
      res.status(400).send("Something went wrong: " + error.message);
    }
  }
);

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const DbPassword = loggedInUser.password;
    const userCurrentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    const isBothSame = await bcrypt.compare(userCurrentPassword, DbPassword);
    if (!isBothSame) {
      throw new Error("Invalid password");
    }

    const hashOfNewPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashOfNewPassword;
    await loggedInUser.save();

    res.json({ message: "Password updated successfully", data: loggedInUser });
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

module.exports = { profileRouter };
