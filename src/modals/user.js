const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, lowercase: true, maxLength: 16 },
    lastName: { type: String, lowercase: true, maxLength: 16 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!isEmail(value)) {
          throw Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    }, // Using minlength here
    phone: { type: Number, required: true, unique: true, trim: true },
    age: { type: Number },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw Error("gender is not valid");
        }
      },
    },
    bio: {
      type: String,
      maxLength: 100,
      default: "this is the default value for the bio",
    },
    skills: { type: [String], lowercase: true },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "hat@4143", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = mongoose.model("UserInstance", userSchema);
