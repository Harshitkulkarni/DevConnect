const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserInstance",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserInstance",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect ststus type`,
      },
    },
  },
  { timestamps: true }
);

//compunding the index
//if suppose there are lacks of connections then it will take lots of time  for db
//  to find who  sent  rquest to whom therefore we use index to
// so that db can identify it easily
//compunding the index
// here it is compunding of index because it needs to check 2 index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

module.exports = mongoose.model("requestInstance", connectionRequestSchema);
