const adminAuth = (req, res, next) => {
  const enteredPassword = 123;
  const actualPassword = 123;

  if (enteredPassword === actualPassword) {
    next();
  } else {
    res.status(404).send("incorrect password");
  }
};

const userAuth = (req, res, next) => {
  const enteredPassword = 123;
  const actualPassword = 123;

  if (enteredPassword === actualPassword) {
    next();
  } else {
    res.status(404).send("incorrect password");
  }
};

module.exports = { adminAuth, userAuth };
