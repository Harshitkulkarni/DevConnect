const express = require("express");
const UserInstance = require("../modals/user");
const { validteSignupData } = require("../utils/isvalidate");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validteSignupData(req);
    const { firstName, lastName, email, password, phone } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new UserInstance({
      firstName,
      lastName,
      email,
      password: passwordHash,
      phone,
    });
    await user.save();
    res.send(firstName + " added successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserInstance.findOne({ email: email });
    if (!user) {
      throw new Error("invaild cradentials");
    }
    const isPasswordcorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordcorrect) {
      throw new Error(" invaild cradentials");
    }
    const token = await user.getJWT();
    // console.log(token);
    res.cookie("token", token);
    res.send(user.firstName + " loged in successfully");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful");
});
module.exports = { authRouter };
