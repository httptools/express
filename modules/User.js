const mongoose = require("mongoose");

const userData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email"],
    },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userData);

module.exports = User;