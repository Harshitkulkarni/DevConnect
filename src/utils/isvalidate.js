const validator = require("validator");
const validteSignupData = (req) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName) {
    throw new Error("write a vaild firstname");
  } else if (!lastName) {
    throw new Error("write a vaild lastName");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not vaild");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  } else if (!phone) {
    throw new Error("incorrect phone number");
  }
};

const isEditDataValid = (req) => {
  //const {firstName,lastName,age,gender,bio,skills } = req.body
  const allowedToEdit = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "bio",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedToEdit.includes(field)
  );

  return isEditAllowed;
};
module.exports = { validteSignupData, isEditDataValid };
