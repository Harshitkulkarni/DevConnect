const jwt = require("jsonwebtoken");
const User = require("../modals/user.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    //console.log(token);
    if (!token) {
      return res.status(401).send("please LogIn ");
    }
    const decodedData = await jwt.verify(token, "hat@4143");
    const { _id } = decodedData;
    // console.log(_id);
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("user do not exist");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { userAuth };
