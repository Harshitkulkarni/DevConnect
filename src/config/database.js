const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://kharshitr:yd1chyHrQwekK27Y@cluster0.o8tlb.mongodb.net/DevConnect"
  );
};

module.exports = { connectDB };
